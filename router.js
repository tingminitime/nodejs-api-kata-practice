const url = require('url')
const { v4: uuidv4 } = require('uuid')
const { PATH, httpStatusCode: statusCode } = require('./config')
const { data: todoData } = require('./data/default')
const isRouteError = require('./helper/checkRouterError')
const { errorHandler, successHandler } = require('./helper/responseHandler')
const { getRequestData, findTargetIndex } = require('./helper/utils')

const todoRouter = async (req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const splitUrl = pathname.split('/').filter(e => e)
  console.log('url query: ', query)
  console.log('req.url: ', pathname)
  console.log('splitUrl: ', splitUrl)

  if (isRouteError(req, PATH)) {
    errorHandler(res, statusCode.NOT_FOUND, '請求路徑錯誤')
    return
  }

  const body = await getRequestData(req)

  switch (req.method) {
    case 'GET':
      if (splitUrl.length === 2) {
        const targetTodoIndex = findTargetIndex(todoData, splitUrl[1])
        if (targetTodoIndex !== -1 && Object.keys(query).length === 0) {
          successHandler(
            res,
            todoData[targetTodoIndex]
          )
        } else if (Object.keys(query).length !== 0) {
          errorHandler(
            res,
            statusCode.BAD_REQUEST,
            '請輸入正確路徑'
          )
        } else {
          errorHandler(
            res,
            statusCode.NOT_FOUND,
            '無此待辦事項'
          )
        }
      } else if (query.complete) {
        const complete = query.complete === 'false' ? false : true
        const completeTodo = todoData.filter(todo => todo.complete === complete)
        successHandler(res, completeTodo)
      } else {
        successHandler(res, todoData)
      }
      break

    case 'POST':
      try {
        const content = JSON.parse(body).content
        if (content) {
          todoData.push({
            id: uuidv4(),
            content,
            complete: false,
          })
          successHandler(res, todoData)
        } else {
          errorHandler(
            res,
            statusCode.BAD_REQUEST,
            '請填寫正確 content 內容'
          )
        }
      } catch (error) {
        console.log('TypeError: ', error)
        errorHandler(
          res,
          statusCode.BAD_REQUEST,
          '欄位未填寫正確'
        )
      }
      break

    case 'DELETE':
      if (pathname === PATH) {
        todoData.length = 0
        successHandler(
          res,
          todoData,
          '已清空所有待辦事項'
        )
      }
      else if (splitUrl.length === 2) {
        const deleteTodoIndex = findTargetIndex(todoData, splitUrl[1])

        if (deleteTodoIndex !== -1) {
          const deleteContent = todoData[deleteTodoIndex].content
          todoData.splice(deleteTodoIndex, 1)
          successHandler(
            res,
            todoData,
            `刪除一筆待辦事項: ${deleteContent}`
          )
        } else {
          errorHandler(
            res,
            statusCode.NOT_FOUND,
            '無此筆待辦事項'
          )
        }
      } else {
        errorHandler(
          res,
          statusCode.BAD_REQUEST,
          '欄位未填寫正確'
        )
      }
      break

    case 'PATCH':
      try {
        if (splitUrl.length === 2) {
          let data = null
          if (body) data = JSON.parse(body)

          const updateTodoIndex = findTargetIndex(todoData, splitUrl[1])

          // 判斷是否有找到此筆待辦
          if (updateTodoIndex !== -1) {
            // 若有 complete query
            if (query.complete) {
              const complete = query.complete === 'false' ? false : true
              todoData[updateTodoIndex].complete = complete
            }

            // 若有 body content
            if (data?.content) {
              todoData[updateTodoIndex].content = data.content
            }

            // 如果都沒有
            if (!query.complete && !Object.keys(data).includes('content')) {
              errorHandler(
                res,
                statusCode.BAD_REQUEST,
                '請輸入正確內容'
              )
              return
            }

            successHandler(res, todoData, '更新成功')
          } else {
            errorHandler(
              res,
              statusCode.NOT_FOUND,
              '無此筆待辦事項'
            )
          }
        }
      } catch (error) {
        console.error('TypeError: ', error)
        errorHandler(
          res,
          statusCode.BAD_REQUEST,
          '欄位未填寫正確'
        )
      }
      break

    case 'OPTIONS':
      successHandler(res)
      break

    default:
      errorHandler(
        res,
        statusCode.NOT_FOUND,
        '404 not found'
      )
      break
  }
}

module.exports = todoRouter