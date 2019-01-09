<template>
    <section>
        <div>
            <ul class="components-list">
                <li draggable="true" @dragstart="dragStart" data-name="TemHum">
                    <temhum />
                </li>
                <li draggable="true" @dragstart="dragStart" data-name="Smoke">
                    <smoke />
                </li>
            </ul>
        </div>
    </section>
</template>
<script>
import Vue from 'vue'
import store from '@/store'
import { mapState, mapActions } from 'vuex'
import nodes from './list/nodes'
export default {
    name: 'componentsBox',
    data() {
        return {}
    },
    mounted() {

    },
    methods: {
        dragStart(e) {
            let componentName = e.target.getAttribute('data-name')
            let info = {
                name: componentName,
                ui: this.activeUI
            }
            e.dataTransfer.setData('info', JSON.stringify(info))
        }
    },
    computed: {
    },
    components: {
        ...nodes
    }
}
</script>
<style lang="less" scoped>
.components-list {
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
}

.components-list * {
    cursor: move!important;
}

.components-list>li {
    min-height: 36px;
    font-size: 18px;
    -webkit-user-select: none;
    transform: scale(0.7)translateX(-15%);
    padding-bottom: 10px;
    transition: transform .2s;
    &:hover {
        transform: scale(1)translateX(5%);
    }
    i {
        vertical-align: middle;
    }
}
</style>
