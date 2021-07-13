const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid')
const dayjs = require('dayjs')


const { promisePool } = require('../database/db.connect')

// todo: error handling


// 根據使用者輸入日期 回應在資料庫中的startTime
router.get('/', async (req, res) => {
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

  const isAvailible = (num) => {
    // 如果同時段內訂單有1筆就不開放訂位
    const minimunOrder = 1
    //const minimunOrder = Math.floor(Math.random() * 6)
  
    return num < minimunOrder
  }
  
  const convertBool = (store) => {
    for (let i in store.availibility) {
      // 訂單數大於1的會變成false, others remain true
      store.availibility[i] = isAvailible(store.availibility[i])
    }
  }

  // default value set to 2021-07028
  const today = new Date().toJSON().split('T')[0] //expected output: 2021-07-21
  const { formattedDate = today } = req.query

  const sql = `SELECT reservations.storeId, reservations.startTime, store.storeName 
              FROM reservations 
              INNER JOIN store ON store.storeId = reservations.storeId
              WHERE date=?`
  
  const [rows, fields] = await promisePool.execute(sql, [formattedDate]);

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

  // 不能訂到過去的時間 假如現在17點 那今天17(包括)以前的時間都應該是flase
  if (formattedDate === today) {
    const currentHour = new Date().getHours() + 1 // expected output: 14

    for (let i in store1.availibility) {
      if (i <= currentHour)
      store1.availibility[i] = false
    }

    for (let i in store2.availibility) {
      if (i <= currentHour)
      store2.availibility[i] = false
    }
  }  
  
  res.json({store1,store2});
});


// write into database
router.post('/', async(req, res) => {
  const { date, startTime, numberOfPeople, storeName } = req.body
  const storeId = storeName === "大安店" ? 1 : 2
  // userId 暫定 最後應該會從req.session裡拿
  const userId = 3 
  const id = nanoid(8)
  const sql = `INSERT INTO reservations (reservationId, userId, date, startTime, storeId, numberOfPeople) VALUE(?, ?, ?, ?, ?, ?)`

  const [rows, fields] = await promisePool.execute(sql, [id, userId, date, startTime, storeId, numberOfPeople])
  if (rows.affectedRows > 0) {
    res.send(id)
    return
  } else {
    res.send('oops, failed')
  }

})


router.delete('/:reservationId', async (req, res) => {
  // client side + server side validation: 訂單在一個小時前不能取消
  // 但因為沒有先預先收錢 其實這蠻沒意義的
  const output = {status: 405, message: 'failed to delete booking record'}
  const { reservationId } = req.params

  const getRecord = "SELECT * FROM reservations WHERE reservationId = ?"
  const [rows, fields] = await promisePool.execute(getRecord, [reservationId]);
  const {date, startTime} = rows[0] 
  
  // do some checking...

  if (true) {
    const sql = "DELETE FROM reservations WHERE reservationId = ?"
    const [rows, fields] = await promisePool.execute(sql, [reservationId]);

    if (rows.affectedRows > 0) {
      output.status = 200
      output.message = 'successfully deleted booking record'
    }
  }
  
  res.status(output.status).json(output.message)
  

})


router.get('/success/:reservationId', async (req, res) => {
  const output = {status: 404, message: 'failed to load information'}
  const { reservationId } = req.params
  const sql = `SELECT reservations.startTime, reservations.date, store.storeName, reservations.numberOfPeople, 
  reservations.reservationId, members.userName, members.userPhone
  FROM reservations 
  INNER JOIN members ON reservations.userId = members.userId
  INNER JOIN store ON reservations.storeId = store.storeId
  WHERE reservationId = ?`

  const [rows, fields] = await promisePool.execute(sql, [reservationId]);
  if (rows.length > 0) {
    rows[0].date = rows[0].date.toJSON().split('T')[0]
    output.status = 200
    output.message = rows[0]
  }
  console.log(output);
  res.status(output.status).json(output.message)

})



router.get('/i-wanna-see-all-booking-records', async(req, res) => {
  const sql = "SELECT * FROM reservations ORDER BY date"
  const [rows, fields] = await promisePool.query(sql);
  console.log(rows.length);
  res.json(rows)
})

module.exports = router;
