const express = require('express');
const router = express.Router();
const { promisePool } = require('../database/db.connect')

const isAvailible = (num) => {
  // 如果同時段內訂單超過五筆就不開放訂位
  //const chance = 5
  const chance = Math.floor(Math.random() * 6)

  return num < chance
}

const convertBool = (store) => {
  for (let i in store.availibility) {
    // 訂單數大於＿的會變成false, 小於5變true
    store.availibility[i] = isAvailible(store.availibility[i])
  }
}


// 根據使用者輸入日期 回應在資料庫中的startTime
router.get('/', async (req, res, next) => {
 const store1 = {
    storeId: '1',
    storeImg: 'https://fakeimg.pl/300/',
    storeName: '大安店',
    address: '台北市大安區通化街28巷2號',
    tel: '02-2703-6603 | 0906-666-265',
    availibility: {
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
    },
  }
  const store2 = {
    storeId: '2',
    storeName: '松山店',
    storeImg: 'https://fakeimg.pl/300/',
    address: '台北市松山區八德路三段12巷11號',
    tel: '02-2579-8608 | 0906-666-265',
    availibility: {
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
    },
  }
  
  //todo: error handling to prevent { } 這個目前無法解決
  const { selectedDate } = req.query || new Date()
  // /booking?selectedDate=2021-07-30T16:00:00.000Z
  const trimDate = selectedDate.split('T')[0]
  // todo: prevent sql injection
  const sql = `SELECT reservations.storeId, reservations.startTime, store.storeName 
              FROM reservations 
              INNER JOIN store ON store.storeId = reservations.storeId
              WHERE date="${trimDate}"`
  
  const [rows, fields] = await promisePool.query(sql);

  rows.forEach((order) => {
    switch (order.storeName) {
      // 找到訂單+1
      case "松山店":
        store2.availibility[order.startTime]++
        break
      
      case "大安店":
        store1.availibility[order.startTime]++
        break
      
      default:
        break
    }
  })

  convertBool(store1)
  convertBool(store2)

  // todo: 不能訂到過去的時間 假如現在17點 那今天17(包括)以前的時間都應該是flase
  // todo: 1. 另外寫個seed.js用node run過一次自動加資料到資料庫 OR 2. 在isAvailible動手腳
  res.json({store1,store2});
});

module.exports = router;
