<template>
  <el-dialog
    :append-to-body="true"
    :before-close="close"
    @closed="close"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible"
    class="tl-dialog check-judge"
    width="700px"
    :title="title"
    :center="true"
  >
    <el-scrollbar>
      <!-- 使命愿景 -->
      <div v-if="type == '1'">
        <div>
          <h3>华润使命</h3>
          <h3>引领商业进步，共创美好生活</h3>
          <p>
            这是华润作为商业机构存在的意义和动机，也是华润必须承担的责任和义务。
            将企业使命与商业进步和社会发展紧紧连在一起，表达了华润在促进整个社会
            的文明与进步中求得企业发展的价值取向，体现了华润人的崇高追求。
          </p>
          <p>
            商业进步是推动国家富强、社会发展的重要动力，美好生活是人们的殷切向往。作为具有光荣历史的红色央企，
            华润曾在不同历史时期都承担了国家使命，始终与国家和民族的命运休戚与共，为民族振兴和社会发展作出了独特的贡献。
            展望未来，华润将通过持续的商业成功，努力打造投资者满意、员工自豪、大众信赖的优秀企业，在促进社会进步、实现
            民族复兴的征途中做出新的贡献。
          </p>
          <h3>华润将从以下四个方面，发挥表率作用，引领商业进步：</h3>
          <p>恪守商业伦理，维护市场规则，引领构建良好的商业生态；</p>
          <p>转变发展方式，创新商业模式，为中国企业提供成功样本；</p>
          <p>履行社会责任，承担央企使命，努力以实际行动回报社会；</p>
          <p>贡献商业智慧，分享最佳实践，为社会进步提供思想源泉。</p>
          <h3>华润将携手客户、股东、员工、伙伴、社会和环境，共创美好生活：</h3>
          <p>
            携手客户，通过提供优质产品与服务，不断超越客户期望，持续创造客户价值；
          </p>
          <p>
            携手股东，通过依法依规治企，提高治理能力与业绩水平，实现企业稳健发展；
          </p>
          <p>
            携手员工，通过权益保护与人文关怀，帮助员工实现价值，提升员工幸福指数；
          </p>
          <p>
            携手伙伴，通过恪守商业道德，营造良好商业环境，开创合作共赢新局；
          </p>
          <p>
            携手社会，通过响应国家号召，投身公益，弘扬主流价值，促进社会和谐发展；
          </p>
          <p>
            携手环境，通过严守环保法规，节能减排，发展循环经济，建设绿色生态文明。
          </p>
          <h3>企业愿景</h3>
          <h3>成为大众信赖和喜爱的全球化企业</h3>
          <p>
            在八十多年的风雨历程中，华润顺应时代潮流和历史趋势，上下求索、积极求变，抓住机遇、不断转型，
            企业始终保持勃勃生机，建立了良好口碑和卓越商誉。在新的历史时期，华润顺势应势、志存高远，以
            “成为大众信赖和喜爱的全球化企业”作为自己的理想蓝图。
          </p>
          <h3>大众信赖和喜爱：</h3>
          <p>
            华润不仅要使企业的产品服务受到客户青睐与喜爱、企业的业绩表现令股东放心和满意、企业的文化氛
            围让员工快乐和自豪，而且积极履行社会责任，受到社会公众喜爱、认可和赞赏，成为同行乃至企业界
            竞相效仿的对象；不仅为股东和客户创造卓越价值，而且还为社会、环境创造令人满意的价值。
          </p>
          <h3>全球化企业：</h3>
          <p>
            以全球化企业为愿景，要求华润努力跻身于国际竞争的大舞台，以全球视野配置资源、拓展市场，以成
            熟和自信，在自由、开放的经济体系中赢得商业成功。华润旗下产业要努力建立行业领导地位，拥有国
            际水平的人才团队、管理水平、运营效率、企业文化和产品品牌，建立国际竞争力、实现全球化发展。
          </p>
        </div>
      </div>
      <!-- 华润战略 -->
      <div v-else-if="type == '2'">
        <p>
          集团正在实施“十三五”发展战略，按照“做实、做强、做大、做好、做长”的发展方式，依托实业发展、
          资本运营的“双擎”之力，借助“国际化、+互联网”的“两翼”之势，通过提升资产质量、优化资本结构、
          调整产业结构、布局全球市场、开展研发创新、提升信息化水平六大举措，实现“跑赢大市、转型升级”
          的目标，为股东创造效益、为社会创造价值、为员工创造成长空间，成为受大众信赖和喜爱的全球化企业。
        </p>
      </div>
      <!-- 公司价值观宣导 -->
      <div v-else-if="type == '3'">
        <dl
          v-for="culture in cultureContent"
          :key="culture.id"
          class="check-item"
        >
          <dt>
            {{ culture.cultureName }}
          </dt>
          <dd>
            {{ culture.cultureDesc }}
          </dd>
        </dl>
        <div v-if="cultureContent.length == 0" class="no-data">
          <div class="bg-no-data"></div>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'mission',
  data() {
    return {
      server,
      dialogTableVisible: false,
      title: '',
      type: '',
      cultureContent: [],
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show(type, title) {
      this.type = type;
      this.title = title;
      this.dialogTableVisible = true;
      this.getCultureContent();
    },
    getCultureContent() {
      this.server.getCultureContent().then((res) => {
        if (res.code == 200) {
          this.cultureContent = res.data || [];
        }
      });
    },
    close() {
      this.dialogTableVisible = false;
    },
  },
  watch: {},
};
</script>