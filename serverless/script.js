var exec = require("child_process").exec;

const getLogStreams = (error, stdout, stderr) => {
  const logStreams = JSON.parse(stdout).logStreams;
  console.log({ logStreams });
  if (error !== null) {
    console.log("exec error: " + error);
  }
};

// exec(
//   "aws logs describe-log-streams --order-by LastEventTime --log-group-name /aws/lambda/test_function",
//   getLogStreams
// );

const getLogEvent = () => {
  const url =
    "aws logs get-log-events --log-group-name /aws/lambda/test_function --log-stream-name '2024/02/01/[$LATEST]405c63878969451ba9c92f0066c8d389'";

  exec(url, (error, stdout, stderr) => {
    const data = JSON.parse(stdout);
    console.log({ data, event: data.events });
    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
};

getLogEvent();
