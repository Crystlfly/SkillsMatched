import Redis from "ioredis";

const redis = new Redis({
  host: "redis-19129.c321.us-east-1-2.ec2.cloud.redislabs.com",
  port: 19129,
  username: "default",
  password: "Wh52K5JSYKWAw7kZGfl8fVSFVqmPHLnG",
});

export default redis;
