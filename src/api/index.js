import request from '@/utils/request'

// 查询事故列表
export async function getAccidentList(params) {
  return request({
    url: '/emergency/getAccidentMQs',
    method: 'GET',
    params,
  })
}

// 根据id查询详情
export async function getDetailById(params) {
  return request({
    url: '/emergency/getAccidentMQDetails',
    method: 'POST',
    params,
  })
}

// 一键已读接口
export async function oneClickRead(params) {
  return request({
    url: '/emergency/oneClickSettingRead',
    method: 'POST',
    params,
  })
}

// 获取视频列表
export async function getCameraList(params) {
  return request({
    url: '/emergency/getUniviewCameraId',
    method: 'GET',
    params,
  })
}

// 获取token
export async function getUser() {
  return request({
    url: '/uniViewOrg/loginToken',
    method: 'post',
  })
}

// 获取视频链接
export async function getVedio(params) {
  return request({
    url: '/uniViewOrg/live/start',
    method: 'post',
    params,
  })
}

// 通知后台关闭保活连接
export async function stopKeeplive(params) {
  return request({
    url: '/uniViewOrg/stoplive',
    method: 'GET',
    params,
  })
}

// 视频token
export async function getVedioToken(params) {
  return request({
    url: '/uniViewOrg/tokenV2',
    method: 'post',
    params,
  })
}

// 获取管理处列表
export async function getManageList() {
  return request({
    url: '/emergency/getOrgList',
    method: 'GET',
  })
}

// 获取事件进展
export async function getEvolveList(params) {
  return request({
    url: '/emergency/getDisposalList',
    method: 'GET',
    params,
  })
}
//判断是否是领导账号
export async function getUserLD(params) {
  return request({
    url: '/uniViewOrg/getUser',
    method: 'GET',
    params,
  })
}
