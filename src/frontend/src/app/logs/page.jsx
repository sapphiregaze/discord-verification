const { readJSON, formatISODate } = require("../../../../backend/util.js");

export default function Logs() {
  let logDisplay = '';
  const logs = readJSON("../../../../../../application.log");
  
  logs.forEach((log) => {
    logDisplay = logDisplay.concat(log.level.toUpperCase(), " - [", 
      formatISODate(log.timestamp), "] - ", log.message, "\n");
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <code className="max-h-96 max-w-7xl bg-[#16161D] p-8 m-8 overflow-auto rounded-md">
          <pre>
            <div>{logDisplay}</div>
          </pre>
        </code>
      </main>
    </>
  );
}