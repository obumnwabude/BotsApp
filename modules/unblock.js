const { MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const Reply =require("../lib/db.js").unblock;

module.exports = {
    name: "unblock",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        try{
            const reply = chat.message.extendedTextMessage;
            var contact = "";
            if (!args.length > 0) {
                contact = reply.contextInfo.participant.split("@")[0];
            } else {
                contact = await inputSanitization.getCleanedContact(
                    args,
                    client,
                    BotsApp
                );
            }

            if (contact === BotsApp.owner.split("@")[0]) {
                client.sendMessage(
                    BotsApp.chatId,
                    Reply.NOT_UNBLOCK_BOT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (args.length > 0) {
                if (isNaN(args[0]) || args[0][0] === "+") {
                    if (args[0][0] === "@" || args[0][0] === "+") {
                        jidNumber = args[0].substring(1, args[0].length + 1);
                    } else {
                        client.sendMessage(
                            BotsApp.chatId,
                            Reply.NUMBER_SYNTAX_ERROR,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        return;
                    }
                } else {
                    jidNumber = args[0];
                }
                if (jidNumber.length < 10 || jidNumber.length > 13) {
                    client.sendMessage(
                        BotsApp.chatId,
                        Reply.NUMBER_SYNTAX_ERROR,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                } else if (jidNumber.length === 10) {
                    jidNumber = "91" + jidNumber;
                }
                JID = jidNumber + "@s.whatsapp.net";
            } else if (!BotsApp.isGroup) {
                JID = BotsApp.chatId;
                jidNumber = JID.substring(0, JID.indexOf("@"));
            } else {
                if (BotsApp.isReply) {
                    if (args.length === 0) {
                        client.sendMessage(
                            BotsApp.chatId,
                            Reply.MESSAGE_NOT_TAGGED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        return;
                    }
                    JID = BotsApp.replyParticipant;
                    jidNumber = JID.substring(0, JID.indexOf("@"));
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        Reply.MESSAGE_NOT_TAGGED,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }
            }
                var JID = contact + "@s.whatsapp.net";
                client.blockUser(JID, "remove");
                client.sendMessage(
                    BotsApp.chatId,
                    "*" + contact + " unblocked successfully.*",
                    MessageType.text
                );

<<<<<<< HEAD
=======
            client.sendMessage(
                BotsApp.chatId,
                "*" + jidNumber + " unblocked successfully.*",
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
>>>>>>> 2abefaa (add catch block to all baileys actions in modules)
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                Reply.MESSAGE_NOT_TAGGED
            );
        }
    },
};