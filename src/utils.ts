import { createNormalizer } from "@zag-js/types";

interface AttrMap {
    [key: string]: string;
}

interface Attrs {
    [key: string]: any; // Change 'any' to the specific type you want to allow for attributes
}

const propMap: AttrMap = {
    Focus: 'Focusin',
    Blur: 'Focusout',
    Change: 'Input',
    DoubleClick: 'Dblclick',
    htmlFor: 'for',
    className: 'class',
    defaultValue: 'value',
    defaultChecked: 'checked',
};

export function attrs(node: HTMLElement, attrs: Attrs): () => void {
    const attrKeys = Object.keys(attrs);

    const addEvt = (e: string, f: EventListener) => {
        e = propMap[e] ?? e;
        node.addEventListener(e.toLowerCase(), f);
    };

    const remEvt = (e: string, f: EventListener) => {
        e = propMap[e] ?? e;
        node.removeEventListener(e.toLowerCase(), f);
    };

    const onEvents = (attr: string) => attr.startsWith('on');
    const others = (attr: string) => !attr.startsWith('on');

    const setup = (attr: string) => addEvt(attr.substring(2), attrs[attr]);
    const teardown = (attr: string) => remEvt(attr.substring(2), attrs[attr]);

    const apply = (attrName: string) => {
        let value = attrs[attrName];

        if (typeof value === 'boolean') {
            value = value || undefined;
        }

        if (value != null) {
            if (['value', 'checked', 'htmlFor'].includes(attrName)) {
                (node as any)[attrName] = value; // Using 'any' here because TypeScript can't narrow the type based on the array check
            } else {
                node.setAttribute(attrName.toLowerCase(), value);
            }
            return;
        }

        node.removeAttribute(attrName.toLowerCase());
    };

    attrKeys.filter(onEvents).forEach(setup);
    attrKeys.filter(others).forEach(apply);

    return function cleanup() {
        attrKeys.filter(onEvents).forEach(teardown);
    };
}

const toStyleString = (style: any) => {
    let string = '';
    for (let key in style) {
        const value = style[key];
        if (value === null || value === undefined) continue;
        if (!key.startsWith('--'))
            key = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        string += `${key}:${value};`;
    }
    return string;
};

export const normalizeProps = createNormalizer((props: any) => {
    return Object.entries(props).reduce<any>((acc, [key, value]) => {
        if (value === undefined) return acc;

        if (key in propMap) {
            key = propMap[key];
        }

        if (key === 'style' && typeof value === 'object') {
            acc.style = toStyleString(value);
            return acc;
        }

        acc[key.toLowerCase()] = value;

        return acc;
    }, {});
});