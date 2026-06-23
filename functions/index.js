/**
 * Cloud Function — envia notificação push quando o status de uma solicitação muda.
 *
 * COMO PUBLICAR (precisa do plano Blaze, pois Cloud Functions exige faturamento):
 *   1. No Firebase Console, faça upgrade do projeto para o plano Blaze.
 *   2. No terminal, dentro da pasta do projeto:
 *        firebase login
 *        cd functions && npm install && cd ..
 *        firebase deploy --only functions
 *
 * O lado cliente (registro do token em /usuarios/{uid}/fcmToken) já está pronto
 * no index.html + firebase-messaging-sw.js. Esta função fecha o ciclo: quando a
 * secretaria muda o status no painel, o cidadão recebe a notificação.
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const COLECOES = ['solicitacoes_obras', 'solicitacoes_saude', 'solicitacoes_educacao', 'solicitacoes_tributos'];
const NOME_SEC = {
  solicitacoes_obras: 'Obras',
  solicitacoes_saude: 'Saúde',
  solicitacoes_educacao: 'Educação',
  solicitacoes_tributos: 'Tributos'
};

function criarTrigger(colecao) {
  return functions.database.ref(`/${colecao}/{id}`).onUpdate(async (change) => {
    const antes = change.before.val() || {};
    const depois = change.after.val() || {};

    // Só notifica quando o status realmente muda
    if (antes.status === depois.status) return null;

    const uid = depois.uid;
    if (!uid) return null; // registro antigo sem uid — não há para quem enviar

    const tokenSnap = await admin.database().ref(`/usuarios/${uid}/fcmToken`).get();
    const token = tokenSnap.val();
    if (!token) return null; // cidadão não ativou notificações

    const protocolo = depois.protocolo ? `#${depois.protocolo} ` : '';
    try {
      await admin.messaging().send({
        token,
        notification: {
          title: `Atualização — Sec. ${NOME_SEC[colecao] || 'Solicitação'}`,
          body: `Sua solicitação ${protocolo}está agora: ${depois.status}.`
        },
        webpush: { fcmOptions: { link: '/solicitacoes.html' } }
      });
    } catch (e) {
      // Token inválido/expirado: remove para não tentar de novo
      if (e.code === 'messaging/registration-token-not-registered') {
        await admin.database().ref(`/usuarios/${uid}/fcmToken`).remove();
      } else {
        console.error('Erro ao enviar push:', e);
      }
    }
    return null;
  });
}

COLECOES.forEach((c) => { exports[c] = criarTrigger(c); });
