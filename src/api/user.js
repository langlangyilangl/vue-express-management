import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function refreshToken(refreshToken) {
  return request({
    url: '/user/getRefreshToken',
    method: 'post',
    data: { refreshToken }
  })
}

// 测试请求
export function test() {
  return request({
    url: '/test',
    method: 'post'
  })
}
