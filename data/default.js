const { v4: uuidv4 } = require('uuid')

module.exports = {
  data: [
    {
      id: uuidv4(),
      content: '預設資料1',
      complete: false,
    },
    {
      id: uuidv4(),
      content: '預設資料2',
      complete: true,
    },
  ]
}