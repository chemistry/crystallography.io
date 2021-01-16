import * as React from 'react';
import { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks';

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require('./index.scss');
}

const defaultAutocompleteOptions = {
    source: 0,
    minChars: 3,
    delay: 150,
    cache: 1,
    menuClass: '',
    renderItemValue(item: any, search: any) {
        return item.value;
    },
    renderItem(item: any, search: any) {
        // escape special characters
        search = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi');
        return '<div class="autocomplete-suggestion" data-val="' + item + '">'
          + item.replace(re, '<b>$1</b>') +
        '</div>';
    },
    // tslint:disable-next-line
    onSelect(e: any, term: any, item: any) {},
};

interface ISuggestedItem {
    value: string;
    isSelected: boolean;
}

export const Input = ({
    initialValue,
    name,
    onChange,
    placeholder,
    autoCompleteOptions,
    suggestionsVisible,
    setSuggestionsVisible
}: {
    initialValue: string,
    name: string,
    onChange:(name: string) => void,
    placeholder: string,
    autoCompleteOptions: any,
    suggestionsVisible: boolean,
    setSuggestionsVisible:(isVisible: boolean)=> void
}) => {
    let cache: any = {};
    let timer: any = null;

    const clickRef = useRef();
    const [value, setValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const lastVal = initialValue;


    useClickOutside(clickRef, ()=> {
        setSuggestionsVisible(false);
    });

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setValue(event.target.value);
        onChange(event.target.value);
    }

    const autoCompleteKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { keyCode } = event;
        const newSuggestions: ISuggestedItem[] = suggestions.slice(0);

        const unselectAll = () => {
            newSuggestions.forEach((item) => {
                item.isSelected = false;
            });
        }

        const hasSelected = () => {
            return newSuggestions.some((item) => {
                return item.isSelected;
            });
        }

        const getSelectedIdx = () => {
            return newSuggestions.findIndex((item) => {
                return item.isSelected;
            });
        }

        // down (40), up (38)
        if ((keyCode === 40 || keyCode === 38) && newSuggestions.length) {
            if (!hasSelected()) {
                if (keyCode === 40) {
                    newSuggestions[0].isSelected = true;
                } else {
                    newSuggestions[newSuggestions.length - 1].isSelected = true;
                }
            } else {
                let idx = getSelectedIdx();
                idx = (keyCode === 40) ? (idx + 1) : (idx - 1);
                idx = idx < 0 ? 0 : idx;
                idx = (idx > newSuggestions.length - 1) ? (newSuggestions.length - 1) : idx;

                unselectAll();
                newSuggestions[idx].isSelected = true;
            }
            setSuggestions(newSuggestions);
            setSuggestionsVisible(true);
        }

        // esc
        if (keyCode === 27) {
            setSuggestionsVisible(false);
        }

        // enter or tab
        if (keyCode === 13 || keyCode === 9) {
            const idx2 = getSelectedIdx();
            if (idx2 > -1) {
                setValue(suggestions[idx2].value);
                onChange(suggestions[idx2].value);
                setSuggestionsVisible(false);
            }
        }
    }

    const autoCompleteKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const keyCode = event.keyCode;

        // Ignore keysymbols
        if ([13, 27, 35, 36, 37, 38, 39, 40].indexOf(keyCode) === -1) {
            if (value.length >= options.minChars) {
                if (value !== lastVal) {
                    clearTimeout(timer);

                    if (options.cache) {
                        if (!cache) {
                            cache = {};
                        }
                        if (value in cache) {
                            if (cache.hasOwnProperty(value)) {
                                autoCompleteSuggest(value, cache[value]);
                                return;
                            }
                        }
                        // no requests if previous suggestions were empty
                        for (let i = 1; i < value.length - options.minChars; i++) {
                            const part = value.slice(0, value.length - i);
                            if (part in cache && !cache[part].length) {
                                autoCompleteSuggest(value, []);
                                return;
                            }
                        }
                    }

                    timer = setTimeout(() => {
                        options.source(value, autoCompleteSuggest);
                    }, options.delay);
                }
            }
        }

        if (value.length < options.minChars) {
            setSuggestionsVisible(false);
        }
    }

    const autoCompleteSuggest = (newValue: any, data: ISuggestedItem[]) => {
        cache[newValue] = data;

        if (data.length && newValue.length >= options.minChars) {
            setSuggestions(data);
            setSuggestionsVisible(true);
        } else {
            setSuggestionsVisible(false);
        }
    }

    const selectSuggestion = (idx: number) => {
        return ()=> {
            const newSuggestions = suggestions.map((res)=> {
                return { isSelected: false, ...res }
            });
            setSuggestions(newSuggestions);
            setSuggestionsVisible(false);
            setValue(suggestions[idx].value);
            onChange(suggestions[idx].value);
        }
    }

    const options = (Object as any).assign({}, defaultAutocompleteOptions, autoCompleteOptions);
    const inputFormClassnames = suggestionsVisible ? 'c-form-input c-form-input--has-recommendation': 'c-form-input';

    return (
        <div className={inputFormClassnames} ref={clickRef}>
            <input type="text"
                className="form-input"
                name={name}
                value={value}
                onChange={onValueChange}
                onKeyDown={autoCompleteKeyDown}
                onKeyUp={autoCompleteKeyUp}
                autoComplete="off"
            />
            {suggestionsVisible ? <Suggestions
                suggestions={suggestions}
                onSelectSuggestion={selectSuggestion}
                renderItemValue={options.renderItemValue}
                value={value}
            />: null}
        </div>
    );
}

const Suggestions = ({
        suggestions, onSelectSuggestion, renderItemValue, value
    }: { suggestions: ISuggestedItem[], onSelectSuggestion: any, renderItemValue: any, value: string }) => {
    return (
        <div className="c-form-input-suggestions"><div className="c-form-input-suggestion-divider"></div>{
            suggestions.map((item, i)=> {
                const classN = item.isSelected ? 'c-form-input-suggestions-item selected' : 'c-form-input-suggestions-item';
                return (<div key={i} className={classN} onClick={onSelectSuggestion(i)}>
                    {renderItemValue(item, value)}
                </div>);
            })
        }</div>
    );
}
