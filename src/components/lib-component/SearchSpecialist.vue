<!-- Search Specialist component -->
<template>
    <div>
        <multiselect v-model="value" tag-placeholder="Add this as new tag" placeholder="Search or add a specialist" label="name" track-by="id" :options="options" :multiple="true" :taggable="true" @tag="addTag" @input="updateOrderData"></multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    import { eventBus } from '../../main'

    export default {
        name: "SearchSpecialist",
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
            }
        },
        data () {
                return {
                value: [],
                options: []
            }
        },
        mounted: function() {
            var specialist_linking = jQuery("#specialist-linking").val();
            var self = this;
            var specialist = [];
            var WooCommerce = new WooCommerceRestApi({
                url: self.config.url,
                consumerKey: self.config.consumerKey,
                consumerSecret: self.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            if (specialist_linking) {
                specialist_linking = JSON.parse(specialist_linking);
                self.options = specialist_linking;
            } else {
                WooCommerce.get('custom/specialist', {
                }).then(function(result) {
                    specialist = result.data;
                    self.options = specialist;
                });
            }
            eventBus.$emit('getSearchSpecialistValue', this.value)
        },
        methods: {
            addTag (newTag) {
                const tag = {
                      name: newTag,
                      id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                }
                this.options.push(tag)
                this.value.push(tag)
            },
            updateOrderData() {
                this.$root.$emit( 'activeOverlay' , true);
                var specialist_linking = jQuery("#specialist-linking").val();
                var self = this;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.config.url,
                    consumerKey: self.config.consumerKey,
                    consumerSecret: self.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                var specialistItem = '';
                var specialist = [];
                var orders = [];
                let item = '';
                let items = [];
                var totalRowsAfterSearch = 0;
                self.$parent.optionsSearch.per_page = self.config.per_page;
                self.$parent.optionsSearch.page = 1;
                self.value.forEach(function(value , key) {
                    specialistItem = {
                        name: value.name,
                        id: value.id
                    }
                    specialist.push(specialistItem);
                })
                if(specialist.length) {
                    specialist = JSON.stringify(specialist);
                    self.$parent.optionsSearch.specialist = specialist;
                } else {
                    if (specialist_linking) {
                        specialist_linking = JSON.stringify(JSON.parse(specialist_linking));
                        self.$parent.optionsSearch.specialist = specialist_linking;
                    } else {
                        self.$parent.optionsSearch.specialist = '';
                    }
                }
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
                                company: value.shipping.company,
                                payment_title: value.payment_method_title,
                                payment: value.payment_method,
                                payment_status: value.payment_status,
                                delivery_method: value.shipping_method,
                                delivery_address: value.shipping.address_1 + " " + value.shipping.address_2,
                                pdf_invoice : value.pdf_invoice,
                                order_detail : value.order_detail,
                                level: 1,
                                show_child: false, 
                                hasChild: 1,
                                display: false,
                                data_child: {}
                            };
                            items.push(item);
                        });
                    }
                    eventBus.$emit('orderUpdate', items)
                    self.$root.$emit('getSearchSpecialistValue', self.value)
                    self.$root.$emit( 'activeOverlay' , false);
                    self.$root.$emit('resetPagition', true);
                    self.$root.$emit('getTotalRowsAfterSearch', totalRowsAfterSearch);
                    self.$root.$emit( 'boardOnWork' , true);
                });
            }
        }
    }
</script>
