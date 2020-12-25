import * as React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Pagination, SearchTab } from "../../components";
import { Input } from "../../components/input";
import { StructuresList } from "../../components/structure-list/structure-list";
import { RootState } from "../../store";
import { SearchState, searchStructureByAuthor } from "../../store/search-by-author-page.slice";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}

interface SearchFormData {
    name: string;
}

const renderItemValue = (item: any, search: any) => {
    // escape special characters
    search = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp('(^' + search.split(' ').join('|') + ')', 'gi');

    // If the data OK - return values
    if (item.value && item.count) {
        let valueWords = item.value.split(' ');
        valueWords = valueWords.map((word: any) => {
            return word.replace(re, '<b>$1</b>');
        });

        const html = valueWords.join(' ');
        return (
            <span>
                <span dangerouslySetInnerHTML={{ __html: html }} />
                <span className="comments">{item.count}</span>
            </span>
        );
    }
}

const autoCompleteSource = (value: any, response: any) => {

    fetch('/api/v1/autocomplete/author?name=' + encodeURIComponent(value), {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res)=> {
        return res.json();
    })
    .then((data)=> {
        if (data.data && Array.isArray(data.data)) {
            const responseData = data.data.map((item: any) => {
                return {
                    value: item.full,
                    count: item.count,
                };
            });
            response(value, responseData);
            return;
        }
        response(value, []);
    })
    .catch(()=> {
        response(value, []);
    });
}

const SearchByAuthorForm = ({ onSubmit, initialValue }: { initialValue: string, onSubmit: (data: SearchFormData) => void }) => {

    const [name, setName ] = useState(initialValue);
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);

    const autoCompleteOptions = {
        minChars: 1,
        delay: 100,
        source: autoCompleteSource,
        renderItemValue,
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setName(event.target.value);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setSuggestionsVisible(false);
        event.preventDefault();

        if (name !== '') {
            onSubmit({ name });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="has-icon-left has-button-right">
                    <i className="form-icon icon icon-search search-layout__search-icon"></i>
                    <Input
                        initialValue={initialValue}
                        name="name"
                        onChange={handleNameChange}
                        placeholder="Enter keyword"
                        suggestionsVisible={suggestionsVisible}
                        setSuggestionsVisible={setSuggestionsVisible}
                        autoCompleteOptions={autoCompleteOptions}
                    />
                    <button className="form-button btn">Search</button>
                </div>
            </div>
        </form>
    )
}

export const SearchByAuthorsPage = () => {

    const dispatch = useDispatch();
    const currentPage = useSelector((state: RootState) => state.searchByAuthorSlice.currentPage);

    const handleSubmit = (data: SearchFormData) => {
        dispatch(searchStructureByAuthor({
            ...data, page: currentPage
        }));
    }
    const searchString = useSelector((state: RootState) => state.searchByAuthorSlice.meta.searchString);

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                  <h2 className="text-primary">Crystal Structure Search</h2>
                  <SearchTab />
            </header>
            <div className="app-layout-content">
                <div className="search-layout__page">
                    <div>
                        <SearchByAuthorForm onSubmit={handleSubmit} initialValue={searchString}/>
                    </div>
                    <div>
                        Search Results
                    </div>
                </div>
            </div>
        </div>
    );
}
