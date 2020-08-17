const STATUS_LIST = [{
  name: '进行中', id: '1',
}, {
  name: '考核中', id: '2',
}, {
  name: '已完成', id: '3',
}, {
  name: '已结束', id: '4',
}, {
  name: '起草中', id: '5',
}, {
  name: '已退回', id: '6',
}];
const STATUS_LIST_MAP = {
  1: '进行中',
  2: '考核中',
  3: '已完成',
  4: '已结束',
  5: '起草中',
  6: '已退回',
};
const CONFIDENCE = [{
  label: '无风险', value: '1',
}, {
  label: '风险可控', value: '2',
}, {
  label: '失控', value: '3',
}];
const CONFIDENCE_MAP = {
  1: '无风险',
  2: '风险可控',
  3: '失控',
};
const OKR_TYPE = {
  1: '部门',
  2: '个人',

};
export default {
  STATUS_LIST,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OKR_TYPE,
  STATUS_LIST_MAP,
};