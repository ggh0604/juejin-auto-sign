import axios from "axios";

const COOKIE = process.env.JUEJIN_COOKIE;

if (!COOKIE) {
  console.error("❌ 未检测到 JUEJIN_COOKIE");
  process.exit(1);
}

const client = axios.create({
  baseURL: "https://api.juejin.cn",
  headers: {
    cookie: COOKIE,
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0",
    referer: "https://juejin.cn/",
  },
  timeout: 10000,
});

// 检查登录状态
async function checkLogin() {
  const res = await client.get("/user_api/v1/user/get");
  if (res.data.err_no !== 0) {
    throw new Error("Cookie 已失效");
  }
  console.log("✅ Cookie 有效");
}

// 查询签到状态
async function getCheckStatus() {
  const res = await client.get("/growth_api/v1/get_today_status");
  return res.data.data;
}

// 执行签到
async function doCheckin() {
  const res = await client.post("/growth_api/v1/check_in", {});
  if (res.data.err_no === 0) {
    console.log("🎉 签到成功");
  } else {
    console.log("⚠️ 签到失败:", res.data.err_msg);
  }
}

async function run() {
  try {
    console.log("========== 掘金自动签到 ==========");
    await checkLogin();

    const status = await getCheckStatus();
    if (status) {
      console.log("✅ 今日已签到");
    } else {
      await doCheckin();
    }
  } catch (err) {
    console.error("❌ 执行失败:", err.message);
    process.exit(1);
  }
}

run();