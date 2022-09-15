<!-- template for the modal component -->
<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="head-content">
                        <h3 class="title-modal">Assign Specialist</h3>
                        <div class="right-content">
                            <button type="button" class="btn btn-modal close" aria-label="Close" @click="$emit('close')">
                                <span aria-hidden="true" style="font-size: 45px!important;">&times;</span>
                            </button>
                        </div>
                        
                    </div>
                    <!-- Search Specialist component -->
                    <div style="margin-top: 40px;">
                        <label class="typo__label"></label>
                        <multiselect v-model="value" :options="options" placeholder="Search a specialist" label="name" track-by="name"></multiselect>
                    </div>
                    <slot name="footer">
                        <button style="margin-top: 10px;" type="button" class="btn btn-light" @click="updateSpecialist">Update</button>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script >
    import Multiselect from 'vue-multiselect'
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    import { eventBus } from '../../main'

    export default {
        name: 'Specialist',
        components: {
          Multiselect
        },
        props: {
            rows: {
                type: Array,
                required: true
            },
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            ModelOrderLogId: Number,
            ModelIndex: Number
        },
        data: function() {
            return {
                value: [],
                options: []
            }
        },
        mounted: function() {
            var self = this;
            var WooCommerce = new WooCommerceRestApi({
                url: self.config.url,
                consumerKey: self.config.consumerKey,
                consumerSecret: self.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            WooCommerce.get('custom/specialist', {
            }).then(function(result) {
                self.options = result.data;
            });
            eventBus.$emit('getSearchSpecialistValue', this.value)
        },
        methods: {
            updateSpecialist () {
                var self = this;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.config.url,
                    consumerKey: self.config.consumerKey,
                    consumerSecret: self.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                WooCommerce.put('custom/specialist/'+self.ModelOrderLogId, {
                    specialist_id : self.value.id
                }).then(function(result) {
                    if(result.data.status == 'success') {
                        let row_id = self.ModelIndex;
                        self.rows[row_id].special_list = self.value.name;
                        self.$emit('close');
                    }
                });
            }
        }
    } 
</script>
<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 70%;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

/*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.title-modal {
    text-align: left;
    float: left;
}

.right-content {
    text-align: right;
    padding-right: 5px;
    cursor: pointer;
}
.right-content .order-id {
    margin-right: 20px;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.modal-footer {
    clear: left;
    width: 100%;
}

</style>
