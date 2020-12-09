const REVIEW_STATUS = {
  0: '复盘结束',
  1: '待复盘',
  2: '待沟通',
  3: '复盘结束',
};

const OKR_BELONGTYPE = {
  1: '部门',
  2: '个人',
};

const REVIEW_STATUS_LIST = [
  { name: '全部', status: '' },
  { name: '待复盘', status: 1 },
  { name: '待沟通', status: 2 },
  { name: '复盘结束', status: 3 },
];
const REPLAY_STATUS_LIST = [
  { name: '全部', status: '' },
  { name: '待复核', status: 3 },
  { name: '已复核', status: 0 },
];
const REVIEW_STATUS_MAP = {
  0: { name: '复盘结束', classname: 'finish-review' },
  1: { name: '待复盘', classname: 'no-review' },
  2: { name: '待沟通', classname: 'no-talk' },
  3: { name: '复盘结束', classname: 'finish-review' },
};
export default {
  REVIEW_STATUS,
  REVIEW_STATUS_LIST,
  OKR_BELONGTYPE,
  REPLAY_STATUS_LIST,
  REVIEW_STATUS_MAP,
};
