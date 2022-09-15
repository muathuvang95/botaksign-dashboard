<!-- Search Specialist component -->
<template>
  <div>
    <div class="text-left">
        <a href="#" v-on:click.prevent="showDropDown=!showDropDown">Settings
          <svg v-if="!showDropDown" width="0.65em" height="0.65em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
          <svg v-else-if="showDropDown" width="0.65em" height="0.65em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
          </svg>
        </a>
    </div>
    <div v-if="showDropDown" class="text-left setting-options">
      <span style="font-weight: 300px">Refresh every</span>
      <input v-model="timeRefresh" type="number" min="30" @change="updateTime(timeRefresh)" name="refresh-board">
      <span>seconds</span>
    </div>
  </div>
</template>

<script>
    import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
    import { eventBus } from '../../main'

    export default {
        name: "RefreshBoard",
        props: {
        config: {
            type: Object,
                    default: function() {
                        return {};
                }
            },
            showLoader: {
                type: Boolean,
                default: false
            },
                searchSpecialistValue: {
                type: Array,
                required: false
            }

        },
        data() {
            return {
                showDropDown: true,
                timeRefresh: '',
            }
        },
        created () {
            var self = this;
            this.$root.$on('refreshBoard', function(status) {
                if(status == true) {
                    self.updateBoard();
                }
            });
        },
        mounted : function(){
            const self = this;
            var WooCommerce = new WooCommerceRestApi({
                url: self.$parent.config.url,
                consumerKey: self.$parent.config.consumerKey,
                consumerSecret: self.$parent.config.consumerSecret,
                wpAPI: true,
                version: 'wc/v3',
            });
            WooCommerce.get('custom/settings').then(function(result) {
                var time = result.data.time_refresh * 1000;
                self.timeRefresh = result.data.time_refresh;
                self.intervalid = setInterval(function() {
                    self.refreshInterval();
                }, time);
                self.$root.$on('boardOnWork', function(status) {
                    if (status == true) {
                        clearInterval(self.intervalid);
                        self.intervalid = setInterval(function() {
                            self.refreshInterval();
                        }, time);
                    }
                });
            });
        },
        methods: {
            refreshInterval: function(){  
                if (!jQuery('.modal-mask').length && !jQuery('.vbt-table-overlay').length) {
                    this.updateBoard();
                }
            },
            updateTime: function(time) {
                const self = this;
                var WooCommerce = new WooCommerceRestApi({
                    url: self.$parent.config.url,
                    consumerKey: self.$parent.config.consumerKey,
                    consumerSecret: self.$parent.config.consumerSecret,
                    wpAPI: true,
                    version: 'wc/v3',
                });
                WooCommerce.get('custom/settings' , {time:time}).then(function(result) {
                    self.timeRefresh = result.data.time_refresh;
                });
            },
            updateBoard: function() {
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
                        })
                        eventBus.$emit('orderUpdate', items);
                    }
                    self.$root.$emit( 'activeOverlay' , false);
                    self.$root.$emit('resetPagition', true);
                    self.$root.$emit('getTotalRowsAfterSearch', totalRowsAfterSearch);
                    self.$root.$emit( 'boardOnWork' , true);
                });
            }
        }

    }
</script>