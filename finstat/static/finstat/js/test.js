var __t, __p = '', __j = Array.prototype.join, print = function () {
    __p += __j.call(arguments, '');
};
with (obj || {}) {
    __p += '<div class="col-md-2"></div>\r\n<div class="col-md-4 finstat__separator format__right">\r\n   <div class="format__inline-block format__ellipsis format__minor">{{ item.category }}</div>\r\n   <div class="format__inline-block finstat__money">\r\n               <span\r\n                     class="\r\n                     ';
    if (income > 0) {
        __p += '\r\n                        ' +
            ((__t = (finstat__bar - income)) == null ? '' : __t) +
            '\r\n                     ';
    } else {
        __p += '\r\n                        ' +
            ((__t = (finstat__bar - outcome)) == null ? '' : __t) +
            '\r\n                     ';
    }
    __p += '\r\n                        ext__editable-for-update"\r\n                     data-type="text"\r\n                     data-name="amount"\r\n                     data-url="/finstat/api/transactions/item/';
    id
    __p += '"\r\n                     data-title="Сумма"\r\n               >\r\n                  ';
    if (income > 0) {
        __p += '\r\n                     +' +
            ((__t = ( item.income )) == null ? '' : __t) +
            '\r\n                  ';
    } else {
        __p += '\r\n                     -' +
            ((__t = ( item.outcome >
            < %
    }
))==null ? '' : __t)+
    '\r\n               </span>\r\n   </div>\r\n</div>\r\n<div class="col-md-3 format__ellipsis">' +
((__t = ( item.comment )) == null ? '' : __t) +
'</div>\r\n<div class="col-md-1 format__minor">\r\n   ';
if (item.account_from) {
    __p += '\r\n      ' +
        ((__t = ( item.account_from )) == null ? '' : __t) +
        '\r\n   ';
}
__p += '\r\n   ';
if (item.account_to) {
    __p += '\r\n      <span class="glyphicon glyphicon-arrow-right"></span>\r\n      ' +
        ((__t = ( item.account_to )) == null ? '' : __t) +
        '\r\n   ';
}
__p += '\r\n</div>\r\n<div class="col-md-2"></div>';
}
return __p;
