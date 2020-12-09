<template>
  <span class="count-down">{{ time }}</span>
</template>

<script>
  export default {
    name: 'count-down',
    props: {
      now: {
        type: Date,
        default: () => new Date(),
      },
      end: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        default: 'DD天HH时mm分ss秒',
      },
    },

    data() {
      return {
        second: 0,
      }
    },

    created() {
      this.start()
    },

    beforeDestroy() {
      clearInterval(this.timer)
    },

    methods: {
      start() {
        const { now, end } = this
        let second = Math.floor((new Date(end) - now) / 1000)

        this.timer = setInterval(() => {
          if (second > 0) {
            this.second = --second
          } else {
            this.$emit('end')
            clearInterval(this.timer)
          }
        }, 1000)
      },
    },

    computed: {
      time() {
        const DD = `0${Math.floor(this.second / (24 * 3600))}`.substr(-2)
        const HH = `0${Math.floor(this.second / 3600 % 24)}`.substr(-2)
        const mm = `0${Math.floor(this.second / 60 % 60)}`.substr(-2)
        const ss = `0${Math.floor(this.second % 60)}`.substr(-2)
        return this.unit.replace('DD', DD).replace('HH', HH).replace('mm', mm).replace('ss', ss)
      },
    },
  }
</script>

<style>
  .count-down {
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
