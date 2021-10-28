const { MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const String = require("../lib/db.js");
const REPLY = String.promote;

module.exports = {
    name: "promote",
    description: REPLY.DESCRIPTION,
    extendedDescription: REPLY.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        // try {
        if (!BotsApp.isGroup) {
            client.sendMessage(
                BotsApp.chatId,
                REPLY.NOT_A_GROUP,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(
                BotsApp.chatId,
                REPLY.BOT_NOT_ADMIN,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        }

        const reply = chat.message.extendedTextMessage;

        if (!args.length > 0) {
            var contact = reply.contextInfo.participant.split("@")[0];
        } else {
            var contact = await inputSanitization.getCleanedContact(
                args,
                client,
                BotsApp
            );
        }

        if (!BotsApp.isReply && typeof args[0] == "undefined") {
            client.sendMessage(
                BotsApp.chatId,
                REPLY.MESSAGE_NOT_TAGGED,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        }

        var admin = false;
        var isMember = await inputSanitization.isMember(
            contact,
            BotsApp.groupMembers
        );
        for (const index in BotsApp.groupMembers) {
            if (contact == BotsApp.groupMembers[index].jid.split("@")[0]) {
                if (BotsApp.groupMembers[index].isAdmin) {
                    admin = true;
                }
            }
        }
        if (isMember) {
            if (!admin == true) {
                const arr = [contact + "@s.whatsapp.net"];
                client.groupMakeAdmin(BotsApp.chatId, arr);
                client.sendMessage(
                    BotsApp.chatId,
                    "*" + contact + " promoted to admin*",
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            } else {
                client.sendMessage(
                    BotsApp.chatId,
                    "*" + contact + " is already an admin*",
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }
        }
        if (!isMember) {
            if (contact === undefined) {
                return;
            }

            client.sendMessage(
                BotsApp.chatId,
                REPLY.PERSON_NOT_IN_GROUP,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        }
    },
};
