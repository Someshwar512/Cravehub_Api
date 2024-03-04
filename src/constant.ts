export enum DatabaseTables {
  USERS = "user",
  DEVICE_TOKEN = "device_token",
  MEMBERSHIP="membership",
  COUNTRY="country",
  STATE="state",
  CITY="city",
  ZIPCODE="zipcode",
  USER_ADDRESS="user_address",
  KITCHENS="kitchen",
  KITCHEN_PHOTOS="kitchen_photos",
  CUISINE="cuisine",
  CHEF_CUISINE="chef_cuisine",
  TAGS="tags",
  CHEF_TAGS="chef_tag",
  INGREDIENTS="ingredients",
  FOODTYPE="foodtype",
  DISH="dish",
  DISH_INGREDIENTS="dish_ingredients",
  DIETARY="dietary",
  DISH_DIETARY="dish_dietary",
  PORTION_SIZE="portion_size",
  BANNER="banner",
  BANNER_ZIPCODE="banner_zipcode",
  OFFER="offer",
  APP_VERSIONS="app_versions",
  AUTH_CLIENT="auth_client",
  AUTH_TOKEN="auth_token",
  OTP_VERFIY="Otp_verfiy",

  OFFER_CHANNEL="offer_channel",
  OFFER_TYPE="offer_type",
  OFFER_ZIPCODE_TYPES="offer_zipcode_types",
  ZIPCODE_OFFERS="zipcode_offers",
  PICKUP_WINDOW="pickup_window",
  EMAIL_TEMPLATE="email_template",
  ORDER_TABLE="order_table",
  REVIEWS="reviews",
  CHEF_MENU="chef_menu",
  ORDER_ITEMS="order_items",
  CART="cart",
  PAYMENT_TRANSACTIONS="payment_transactions",
  ADMIN_SETTINGS="admin_settings",
  FAVOURITES="favourites",
  NOTIFICATIONS="notifications",
}

export enum Roles {
  ADMIN = "ADMIN",
  USER = "USER",
  CHEF = "CHEF"
}

export enum Status {
  ACTIVE= "ACTIVE",
INACTIVE="INACTIVE"
}

export enum UserVerfiy{
  VERFIED="VERFIED",
  NOT_VERFIED="NOT_VERFIED"

}
export enum Deleted_Status{
DELETED="DELETED",
NOT_DELETED="NOT_DELETED"
}

export enum UserMembership{
  BASIC="BASIC",
  PREMIUM="PREMIUM"
}

export enum DeviceType{
   ANDROID="ANDROID",
   IOS="IOS",
}

export enum BannerType{
  OFFER="OFFER",
  MARKETING="MARKETING"
}

export enum UpdateType{
  FORCED="FORCED",
  OPTIONAL="OPTIONAL",
}

export enum OtpUse{
  USED="USED",
  NOT_USED="NOT_USED",
}
export enum AutoApplied{
  TRUE="TRUE",
  FALSE="FALSE"
}

export enum DiscountType{
  PERCENTAGE="PERCENTAGE",
  FLAT_DISCOUNT="FLAT_DISCOUNT"
}

// Enum for OTP verification types
export enum OtpVerificationType {
  PASSWORD = 'PASSWORD',
  SIGNUP = 'SIGNUP',
}

export enum OrderStatus {
  PLACED = 'PLACED',
  INPROGRESS = 'INPROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}


export enum Reviews_Type
{
  CHEF='CHEF',
  DISH='DISH',
}

export enum Food_Type {
  VEG ='VEG',
  NON_VEG ='NON_VEG',
  BOTH = 'BOTH',
}

export enum DeliveryPreference {
  DELIVERY= "DELIVERY",
  PICKUP="PICKUP"
}

export enum DeleteCartAction{
  SINGLE="SINGLE",
  ALL="ALL",
}

export enum PaymentStatus{
CREATED="CREATED",
PAID="PAID",
}

