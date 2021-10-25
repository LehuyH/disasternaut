<template>
    <transition name="fade">
        <section class="letter hud-element overlay" v-if="state.interaction.showLetter">
            <div class="audit-content">
                <section v-if="state.interaction.quotaSuccess">
                    <h1>Congratulations Notice</h1>
                    Dear esteemed colonizer, {{ state.persistent.name }}
                    <br />
                    <br />Congratulations on reaching your quota! This achievement is due to your hard work, dedication and
                    ingenuity.
                    <br />
                    <br />This was achieved by a combination of our technology and your own determination. As a symbol of our
                    gratitude
                    <b>you will receive upgrades to your armor</b>.
                    <br />
                    <br />Your next quota has been assigned! We look forward to seeing your continued progress.
                    <br />
                    <br />
                    <br />Thanks,
                    <br />
                    <i>The HUGE Board</i>
                </section>
                <section v-else-if="state.persistent.failures === 1">
                    <h1>Notice Of Audit</h1>
                    Dear esteemed colonizer, {{ state.persistent.name }}
                    <br />
                    <br />In order to uphold the contract we have agreed upon with your planet, we would like to remind you that
                    your
                    quota MUST be sent to us on time.
                    <br />
                    <br />To ensure that all our resources are met, we will be conducting an audit of your resources. This audit
                    process will evaluated on
                    <b>Day {{ state.persistent.quotaDay }}</b>. The duration of the audit will be
                    <b>{{ (state.persistent.quotaDay || 0) - state.persistent.day }} days</b>.
                    <br />
                    <br />During the audit, we will monitor your planetary activity and make sure your resources are distributed
                    appropriately. If this does not happen, we will have no choice but to revoke your planetary charter.
                    <br />
                    <br />If your audit is deemed a success, we will send your planet a congratulatory packet. However, if you do
                    not
                    abide by our terms, you will not receive the congratulations.
                    <br />
                    <br />We hope you understand the importance of meeting your quotas.
                    <br />
                    <br />
                    <br />Thanks,
                    <br />
                    <i>The HUGE Board</i>
                </section>
                <section v-else-if="state.persistent.failures === 2">
                    <h1>Audit Failure Notice</h1>
                    Dear colonizer, {{ state.persistent.name }}
                    <br />
                    <br />Your audit was conducted and reviewed by our highly efficient auditing staff. However, the auditors had
                    a
                    hard time determining the effectiveness of your efforts in reaching the quota we set for you. As a
                    result,
                    we have deemed that your quota has not yet been achieved.
                    <br />
                    <br />As a LAST RESORT, we will offer a final audit to insure your progress. If your planet fail this audit
                    too,
                    we will have no choice but to revoke your charter and the colony. If your planet fails to reach the
                    FINAL
                    quota in the FINAL audit, we will be forced to revoke your charter.
                    <br />
                    <br />
                    <b>
                        This will be the LAST audit you will receive. The Quota is due on Day
                        {{ state.persistent.quotaDay }}
                    </b>
                    <br />
                    <br />
                    <br />Thanks,
                    <br />
                    <i>The HUGE Board</i>
                </section>
                <section v-else-if="state.persistent.failures === 3">
                    <h1>Termination Notice</h1>Your charter and colony has been terminated. You are no longer welcome within the HUGE community.
                    <br />Access to any of HUGE's services has been revoked.
                    <br />Your missing quotas have been transfered into debt. If you ever repay the debt we wil gladly offer another opportunity for your planet.
                    <br />
                    <br />
                    <b style="color:var(--huge)">Good Luck</b>
                    <br />
                    <br />
                    <br />Thanks,
                    <br />
                    <i>The HUGE Board</i>
                </section>
                <br />
                <section class="new-quota">
                    <div class="quota-info">
                        <h1 v-if="state.persistent.failures < 3">Your New Quota</h1>
                        <h1 v-else>Your Debt</h1>
                        <p v-for="([rss, target]) in Object.entries(state.persistent.quota)">
                            <b>{{ rss }}:</b>
                            {{ target }}
                        </p>
                    </div>
                    <div class="accept-container">
                        <button @click="dismiss" style="--accent: var(--huge);">I understand</button>
                    </div>
                </section>
            </div>
        </section>
    </transition>
</template>


<script setup lang="ts">
import { state } from "@/state"
import k from "@/kaboom"

function dismiss() {
    //Give player extra max health if success
    if (state.interaction.quotaSuccess) {
        state.persistent.maxHealth++;

        state.persistent.health = (0 + state.persistent.maxHealth)
    }
    k.get("player")[0].allowMovement = true
    state.interaction.showLetter = false

}
</script>

<style scoped>
.letter {
    z-index: 20;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.audit-content {
    padding: 2% 1%;
    width: 50vw;
    background-color: #1b233b;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

h1 {
    color: var(--huge);
}
.new-quota {
    display: flex;
    justify-content: center;
    align-items: center;
}

.quota-info {
    text-align: right;
    margin-right: 15px;
}
</style>