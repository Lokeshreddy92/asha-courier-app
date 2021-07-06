const dateFormat = require("dateformat"),
  mongoose = require("mongoose"),
  _ = require("underscore"),
  Config = require("../config/config"),
  cron = require("node-cron"),
  shell = require("shelljs");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Config.sendgrid_api_key);

module.exports = async function () {
  cron.schedule(
    "59 23 * * *",
    async function () {
      try {
        let date = new Date(),
          m = date.getMonth() + 1,
          d = date.getDate();
        console.log("Running Cron Job");
        //TODO: mongodump --authenticationDatabase admin --username admin --password CHOWDARY19 -d SmartHRM_Production -h localhost
        if (
          shell.exec(
            `mongodump --authenticationDatabase admin --username admin --password CHOWDARY19 -d SmartHRM_Production -h localhost`
          ).code !== 0
        ) {
          shell.exit(1);
        } else {
          shell.echo("Database backup complete");
          const msg = {
            to: "jyotheeswar.chowdary@smarterp.com",
            from: "jyotheeswar.chowdary@smarterp.com",
            subject: "Mongo Backup!",
            html: `Hello...  <br /> <br /> Mongo Backup Completed! `,
          };
          sgMail.send(msg);
        }
      } catch (err) {
        console.log(err, "err");
      }
      console.log("running a task every day");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};
