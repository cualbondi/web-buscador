<template>
    <div>Live feed</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Live extends Vue {

    mounted(){
        const sock = new WebSocket("ws://localhost:8084/subscribe")
        sock.onopen = () => {
            const message = {
                position: 'POINT (-62.28849501342586 -38.7461138161239)',
                recorridos: [1298, 2633]
            }
            sock.send(JSON.stringify(message))
        }
        sock.onmessage = (event: MessageEvent) => {
            console.log('recieved ', event.data)
        }
    }
}
</script>
