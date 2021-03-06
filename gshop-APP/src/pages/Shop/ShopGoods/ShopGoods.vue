<template>
  <div>
    <div class="goods">
      <!--左侧的menu列表-->
      <div class="menu-wrapper">
        <ul>
          <!--类名current标识当前分类-->
          <li v-for="(good,index) in goods" :key="index" class="menu-item"
              :class="{current:currentIndex===index}"
              @click="clickMenuItem(index)">
          <span class="text bottom-border-1px">
              <img v-if="good.icon" class="icon" :src="good.icon">{{ good.name }}</span>
          </li>
        </ul>
      </div>
      <!--右侧的食物列表-->
      <div class="foods-wrapper">
        <ul ref="foodsWarpperUl">
          <!--其他所有类型商品-->
          <li v-for="(good,index) in goods" :key="index" v-if="goods" class="food-list-hook"
              :class="`item-${index}`">
            <h1 class="title">{{ good.name }}</h1>
            <ul>
              <li @click="showFood(food)" v-if="good.foods" v-for="(food,index2) in good.foods" :key="index2"
                  class="food-item bottom-border-1px">
                <div class="icon"><img width="57" height="57" :src="food.icon"></div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售 {{food.sellCount}} 份</span>
                    <span>好评率 {{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <ShopCart/>
    <Food :food="perFood" ref="perFood"/>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import BScroll from 'better-scroll'
import Food from '../../../components/Food/Food'
import ShopCart from '../../../components/ShopCart/ShopCart'
import CartControl from '../../../components/CartControl/CartControl'

export default {
  path: 'Shop',
  name: 'ShopGoods',
  components: {
    Food,
    ShopCart,
    CartControl
  },
  data() {
    return {
      scrollY: 0, //右侧 Y 轴滑动的坐标
      tops: [], // 所有右侧分类li的scrollTop的值组成的数组 初始化完成后，就统计完毕
      perFood: {}
    }
  },
  computed: {
    ...mapState('Shop', {
      goods: state => state.goods
    }),
    //计算当前分类的下标 与之相关的数据 scrollY和tops
    currentIndex() {
      const {scrollY, tops} = this
      //返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1
      const newIndex = tops.findIndex((top, index) => {
        return scrollY >= top && scrollY < tops[index + 1]
      })
      return newIndex
    }
  },
  mounted() {
    // 获取商品信息列表 goods 更新了, 界面还没有更新
    this.getShopGoodsList().then(() => {
      // this.$nextTick是列表数据显示以后，立即执行函数
      this.$nextTick(() => {
        this.initScroll()  //初始化滚动
        this.initTops() //初始化tops数组（必须是右侧列表填充完毕才可以）
      })
    })
  },
  methods: {
    ...mapActions('Shop', ['getShopGoodsList']),
    //初始化tops数组
    initTops() {
      const newTops = []
      let top = 0
      //第一个数据是0
      newTops.push(top)
      // 得到 ul 下所有的子 li
      const lis = this.$refs.foodsWarpperUl.getElementsByClassName('food-list-hook')
      Array.prototype.slice.call(lis).forEach((li, index) => {
        top += li.clientHeight
        newTops.push(top)
      })
      // 保存 tops
      this.tops = newTops
    },
    //初始化滚动
    initScroll() {
      //左侧分类列表
      this.menuScroll = new BScroll('.menu-wrapper', {
        click: true //响应点击
      })
      // 右侧 food 列表的 BScroll
      this.foodsScroll = new BScroll('.foods-wrapper', {
        probeType: 2, // 手指滑动(惯性滑动和编码滑动不监视)
        click: true //响应点击
      })
      //监视滑动过程
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(pos.y) //获取绝对值
      })
      // 监视滑动结束
      this.foodsScroll.on('scrollEnd', (pos) => {
        console.log('滑动结束', pos.y)
        this.scrollY = Math.abs(pos.y) // 解决惯性滑动更新
      })
    },
    //点击左侧分类项
    clickMenuItem(index) {
      console.log('当前选中项下标：' + index)
      //获取右侧对象下标的tops数值
      const top = this.tops[index]
      this.scrollY = top
      //滑动到指定的位置
      this.foodsScroll.scrollTo(0, -top, 300)
    },
    //显示food详细信息
    showFood(food) {
      //设置perFood的值
      this.perFood = food
      //父组件调用子组件Food里面的toggleShow方法()
      this.$refs.perFood.toggleShow()
    }
  }
}
</script>

<style scoped lang='scss'>
  @import "../../../common/scss/mixins";

  .goods {
    display: flex;
    position: absolute;
    top: 195px;
    bottom: 46px;
    width: 100%;
    background: #fff;
    overflow: hidden;

    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;

      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        line-height: 14px;

        &.current {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          color: $green;
          font-weight: 700;

          .text {
            @include border-none();
          }
        }

        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }

        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          @include bottom-border-1px(rgba(7, 17, 27, 0.1));
          font-size: 12px;
        }
      }
    }

    .foods-wrapper {
      flex: 1;

      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }

      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include bottom-border-1px(rgba(7, 17, 27, 0.1));

        &:last-child {
          @include border-none();
          margin-bottom: 0;
        }

        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }

        .content {
          flex: 1;

          .name {
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }

          .desc, .extra {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }

          .desc {
            line-height: 12px;
            margin-bottom: 8px;
          }

          .extra {
            .count {
              margin-right: 12px;
            }
          }

          .price {
            font-weight: 700;
            line-height: 24px;

            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }

            .old {
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }

          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
