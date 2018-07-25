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
                position: 'POINT (-38.7406530000000018 -62.2151870000000002)',
                recorridos: [0,1,2,3]
            }
            sock.send(JSON.stringify(message))
        }
        sock.onmessage = (event: MessageEvent) => {
            console.log('recieved ', event.data)
        }
    }
}
</script>
