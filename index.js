var url = require('url');

module.exports = function (root, opts, cb) {

    if (!cb) {
        cb = opts;
        opts = {};
    }

    root.addEventListener('click', function (ev) {
        if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
            return true;
        }
        var isOutbound = false;
        
        var anchor = null;
        for (var n = ev.target; n.parentNode; n = n.parentNode) {
            if (n.nodeName === 'A') {
                anchor = n;
                break;
            }
        }
        if (!anchor) return true;
        
        var href = anchor.getAttribute('href');
        var u = url.parse(anchor.getAttribute('href'));
        
        if (u.host && u.host !== location.host) {
            console.log('Outbound link');
            console.log(opts);
            if (!opts.catchOutbound) return true;
            isOutbound = true;
        }
        
        
        ev.preventDefault();
        
        var base;
        if (isOutbound) {
            base = u.protocol + '//' + u.host;
        } else {
            base = location.protocol + '//' + location.host;
        }
        console.log('Base: ' + base);
        
        var returnUrl = base + url.resolve(location.pathname, u.path || '') + (u.hash || '');

        cb(returnUrl, isOutbound);
        return false;
    });
};
