
let ReactGA: any;
if (process.env.BROWSER) {
    // tslint:disable-next-line
    ReactGA = require('react-ga');
}
export const useAnalyticsEvent = () => {
    return ({ category, action }: { category: string, action: string }) => {
        if (ReactGA) {
            ReactGA.event({ category, action });
        }
    }
};
