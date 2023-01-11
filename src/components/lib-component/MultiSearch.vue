<template>
    <!-- <div>
        <multiselect v-model="value"  label="name" track-by="code" :placeholder="column.filter.placeholder" :options="column.filter.options"  @input="multiSearchOrder">
        </multiselect>
    </div> -->
    <div>
        <div class="dropdown">
            <select style="width: 40%" class="form-control custom-select" v-if="column.numberCol == '2' ? true : false" v-on:change="multiSearchOrder($event , 'payment_status')">
                <option class="dropdown-item" value="0">All</option>
                <!-- <option class="dropdown-item" v-for="option in column.filterSub.options" v-bind:value="option.value">{{option.name}}</option> -->
                <option class="dropdown-item" value="paid">&#xf05d; Paid </option>
                <option class="dropdown-item" value="pendding">&#xf017; Pending</option>
                <option class="dropdown-item" value="cancelled">&#xf05e; Cancelled</option>
            </select>
            <select v-bind:style="column.numberCol == '2' ? 'width: 55%' : ''" class="form-control custom-select" v-on:change="multiSearchOrder($event)">
                <option class="dropdown-item" value="0">All</option>
                <option class="dropdown-item" v-for="option in column.filter.options" v-bind:value="option.value">{{option.name}}</option>
            </select>
        </div>
    </div>
</template>
<script>
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { eventBus } from '../../main';
import Multiselect from 'vue-multiselect'

export default {
    name: 'MultiSearch',
    title: 'All',
    props: {
        column: {
            type: Object,
            default: function() {
                return {};
            }
        },
        searchSpecialistValue: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            options: [],
            value: [],
        }
    },
    mounted: function() {

    },
    methods: {
        multiSearchOrder: function(event , payment_status) {
            this.$root.$emit( 'activeOverlay' , true);
            var specialist_linking = jQuery("#specialist-linking").val();
            var self = this;
            var WooCommerce = new WooCommerceRestApi({
                url: self.$parent.config.url,
                consumerKey: self.$parent.config.consumerKey,
                consumerSecret: self.$parent.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            var orders = [];
            let item = '';
            let items = [];
            var specialistItem = '';
            var specialist = [];
            var totalRowsAfterSearch = 0;
            var specialist = [];
            var specialistItem = {};
            switch (self.column.name) {
                case 'payment':
                    if(event.target.value != 0 || event.target.value != '') {
                        if(payment_status == 'payment_status') {
                            self.$parent.optionsSearch.payment_status = event.target.value;
                        } else {
                            self.$parent.optionsSearch.payment = event.target.value;
                        }
                    }
                    break
                case 'delivery': 
                    if(event.target.value != 0 || event.target.value != '') {
                        self.$parent.optionsSearch.company = event.target.value;
                    }
                    break
                case 'status': 
                    if(event.target.value != 0 || event.target.value != '') {
                        self.$parent.optionsSearch.status = event.target.value;
                    }
                    break
                case 'completion':
                    if(event.target.value != 0 || event.target.value != '') {
                        self.$parent.optionsSearch.completion = event.target.value;
                    }
                    break
                case 'delivery_method': 
                    if(event.target.value != 0 || event.target.value != '') {
                        self.$parent.optionsSearch.delivery = event.target.value;
                    }
                    break
                default: 
                    break
            }
            if (self.searchSpecialistValue.length) {
                self.searchSpecialistValue.forEach(function(value , key) {
                    specialistItem = {
                        name: value.name,
                        id: value.id
                    }
                    specialist.push(specialistItem);
                })
            }
            if(specialist.length || specialist_linking) {
                specialist = specialist.length ? JSON.stringify(specialist) : JSON.stringify(JSON.parse(specialist_linking));
            }
            self.$parent.optionsSearch.per_page = self.$parent.config.per_page;
            self.$parent.optionsSearch.page = 1;
            self.$parent.optionsSearch.specialist = specialist;
            WooCommerce.get('custom/search' , self.$parent.optionsSearch ).then(function(result) {
                orders = result.data.orders;
                totalRowsAfterSearch = result.data.total;
                if (orders == null) {   
                    eventBus.$emit('orderUpdate', []);
                } else {
                    orders.forEach(function(value , key) {
                        item = {
                            index: key,
                            order_id: value.id,
                            show: 1,
                            special_list: value.specialist.name,
                            order_file: value.link_download,
                            status: value.status,
                            date_time: value.date_created,
                            expiring: value.expiring,
                            completion: value.date_completed,
                            order_on_hold: value.order_on_hold,
                            date_time_out: value.order_time_out,
                            name: value.full_name,
                            user_link: value.user_link,
                            company: value.shipping.company,
                            payment_title: value.payment_method_title,
                            payment: value.payment_method,
                            payment_status: value.payment_status,
                            delivery_method:  value.shipping_method,
                            delivery_address: value.shipping.address_1 + " " + value.shipping.address_2,
                            pdf_invoice : value.pdf_invoice,
                            order_detail : value.order_detail,
                            level: 1,
                            show_child: false, 
                            hasChild: 1,
                            display: false,
                            data_child: {},
                            specialist: value.specialist
                        };
                        items.push(item);
                    }) 
                }
                eventBus.$emit('multiSearch', items);
                self.$root.$emit( 'activeOverlay' , false);
                self.$root.$emit('resetPagition', true);
                self.$root.$emit('getTotalRowsAfterSearch', totalRowsAfterSearch);
                self.$root.$emit( 'boardOnWork' , true);
            });
        }
    },
    computed: {

    },
    components: {
        Multiselect
    }
}
</script>
<style scoped>
    
</style>
