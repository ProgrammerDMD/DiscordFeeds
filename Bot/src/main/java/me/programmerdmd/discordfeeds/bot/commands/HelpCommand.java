package me.programmerdmd.discordfeeds.bot.commands;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class HelpCommand extends ListenerAdapter {

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        if (event.getName().equals("help")) {
            event.replyEmbeds(new EmbedBuilder().setTitle("Instructions for setting up")
                            .setDescription("In order to create new feeds, and receive notifications in discord channels or through webhooks, you must use " +
                                    "our dashboard." +
                                    "\nYou can receive notifications for the following platforms: **YouTube** and **Reddit**")
                            .addField("Website", "https://discordfeeds.com", true)
                            .addField("Discord Server", "https://discord.gg/GPB7jpBV5Q", true).build()).queue();
        }
    }

}
