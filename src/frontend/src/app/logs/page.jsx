const util = require("../../../../backend/util.js");

export default function Logs() {
  let logDisplay = '';
  const logs = util.readLogs("../../../../../../application.log");
  
  logs.forEach((log) => {
    logDisplay = logDisplay.concat(log.level.toUpperCase(), " ", 
      util.formatISODate(log.timestamp), " ", log.message, "\n");
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-background text-text">
      <pre className="whitespace-pre-wrap">
        <div>{logDisplay}</div>
      </pre>
    </main>
  );
}