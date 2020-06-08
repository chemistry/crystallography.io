import * as React from "react";
import { MutableRefObject, useState } from "react";
import { useCallback } from "react";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { LoaderIcon } from "./loader-icon";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const Loader: React.SFC<{ isVisible: boolean, scrollElement: MutableRefObject<any>}> = ({ isVisible,  scrollElement, children }) => {
    const containerRef = useRef(null);
    const [top, setTop] = useState("50%");

    const handler = useCallback(() => {
        const container = containerRef.current;
        const parentEl = scrollElement.current;

        if (parentEl && container && container.clientHeight > 0) {
            const parentOffsetTop = container.offsetTop;
            const parentHeight = container.clientHeight;

            const h = parentEl.clientHeight; // window.innerHeight;
            const scrollTop = parentEl.scrollTop; // window.scrollY;

            const h1 = Math.max(parentOffsetTop - scrollTop, 0);
            const h2 = Math.min(parentOffsetTop + parentHeight - scrollTop, h);

            const pos = ((h1 + h2) / 2) + scrollTop - parentOffsetTop - 5;
            const mTop = parseInt(top, 10);
            if (mTop &&  Math.abs(mTop - pos) > 2) {
                setTop(`${pos}px`);
            }
        } else {
            setTop("50%");
        }
    }, []);

    useLayoutEffect(() => {
        const parentEl = scrollElement.current;
        if (parentEl) {
            window.addEventListener("resize", handler);
            parentEl.addEventListener("scroll", handler);

            setTimeout(handler, 0);
            return () => {
                window.removeEventListener("resize", handler);
                parentEl.removeEventListener("scroll", handler);
            };
        }
    });

    if (isVisible) {
        return (
            <div className="c-loader-container" ref={containerRef}>
            <div className="c-loader-wrap">
                <div className="c-loader-img" style={{top}}><LoaderIcon /></div>
            </div>
            {children}
        </div>
        );
    } else {
        return (
            <div className="c-loader-container" ref={containerRef}>{children}</div>
        );
    }
};
