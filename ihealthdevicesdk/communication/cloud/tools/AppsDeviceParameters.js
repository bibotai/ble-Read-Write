/**
 * Created by Fwind on 2016/12/28.
 * User_SDK配置参数
 */
export const AppsDeviceParameters = {

    //是否下载隐私条款
    //正式版置为true
    //Watch版置为false
    //往后只维护一版SDK，且新用户注册不再提示隐私条款，20150814_ZYG
    //const IsNeedDownloadPrivacy = false;

    isLog: true,//调试Log开关
    isOfficial: true,// 是否是正式服务器
    isUpLoadData: false,//数据上云开关

    webSite: "https://api.ihealthlabs.com:443",//接口正式服务器地址 .htm
    AddressCenter: "https://api.ihealthlabs.com:443/apicenter/", //中心接口服务器地址-正式 .htm
    path: "/api5/",//地址路径
    Address: "https://api.ihealthlabs.com:443/api5/", //地址+路径

    //与实际输出版本保持一致
    APP_VERSION: "ASDK_2.3.0.2",//接口版本
    SC: "7c789858c0ec4ebf8189ebb14b6730a5",//5.0地址SC

    //指令超时时间
    Delay_Short: 2000,
    Delay_Medium: 4000,
    Delay_Long: 8000,
    Delay_LongLong: 16000,
}