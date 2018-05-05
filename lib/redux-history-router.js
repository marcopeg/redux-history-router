'use strict';

// import logger from '@marcopeg/utils/lib/logger'
// import matchPath from './match-path'
var matchPath = require('./match-path');

/**
 * const config = {
 *     allowMultipleRoutes: false,
 * }
 */

var createHistoryRouter = function createHistoryRouter(routes) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function (location) {
        return function (dispatch) {
            if (!location) {
                return;
            }

            var pathname = location.pathname;


            try {
                var allMatchingRoutes = routes.map(function (route) {
                    return Object.assign({}, route, {
                        match: matchPath(pathname, {
                            path: route.path,
                            exact: route.exact
                        })
                    });
                }).filter(function (route) {
                    return route.match;
                });

                var applicableRoutes = config.allowMultipleRoutes ? allMatchingRoutes.map(function (i) {
                    return i;
                }) : [allMatchingRoutes.shift()];

                applicableRoutes.forEach(function (_ref) {
                    var action = _ref.action,
                        match = _ref.match;

                    if (action) {
                        dispatch(action(match.params, match));
                        dispatch({
                            type: '@@route::fired',
                            payload: Object.assign({}, location, {
                                params: match.params
                            })
                        });
                    }
                });
            } catch (e) {
                console.log('Path handler not found for:', pathname);
            }
        };
    };
};

module.exports = createHistoryRouter;