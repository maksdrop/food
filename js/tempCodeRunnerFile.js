// 'use strict';

// console.log('Отправляем запрос');

// const req = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log('Ждем ответ..');
  
//     const user = {
//       name: 'Diana',
//       age: 20
//     }
  
//     resolve(user);
  
//   }, 2000)
// })

// req.then(user => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       user.status = 'online';
//       resolve(user);
//     }, 2000)
//   });
// }).then(data => {
//   data.gender = 'female';
//   return data;
  
// }).then(data => {
//   console.log(data);
// }).catch(() => {
//   console.error('Ошибка!');
// }).finally(() => {
//   console.log('finally');
// })


const test = time => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  })
}

// test(1000).then(() => {
//   console.log('Загрузка прошла успешно');
// })

// test(2000).then(() => {
//   console.log('Загрузка прошла успешно');
// })

// Promise.all([test(1000), test(2000)]).then(() => {
//   console.log('All');
// })

Promise.race([test(100), test(2000)]).then(() => {
  console.log('All');
})
