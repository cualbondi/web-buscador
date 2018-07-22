<template>
    <div>Live feed</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Live extends Vue {

    mounted(){
        const sock = new WebSocket("ws://localhost:8084/subscribe")
        sock.onmessage = (event: MessageEvent) => {
            console.log('recieved ', event.data)
        }
        sock.onopen = () => {
            const message = {
                position: "POINT (1 1)",
                recorridos: [1,2,3]
            }
            sock.send(JSON.stringify(message))
        }
    }
}
</script>
