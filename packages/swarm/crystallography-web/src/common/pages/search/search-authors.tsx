import * as React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, NoSearchResults, Pagination, SearchTab } from "../../components";
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

    const handleNameChange = (nameValue: string) => {
        setName(nameValue);
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

const SearchSummary = ({ totalResults }: {totalResults: number })=> {
    return (
        <div className="search-layout__results-header">
            <h4 className="text-primary">Results: {totalResults}</h4>
        </div>
    )
}

const SearchResults = ()=> {
    const dispatch = useDispatch();
    const containerRef = useRef(null);
    const isLoading = useSelector((state: RootState) => state.searchByAuthorSlice.isLoading);
    const structures = useSelector((state: RootState) => {
        const structuresIds = state.searchByAuthorSlice.data.structureIds;
        const structuresById: any = state.searchByAuthorSlice.data.structureById;

        return structuresIds.map((id) => {
            return structuresById[id];
        }).filter((item) => !!item);
    });
    const currentPage = useSelector((state: RootState) => state.searchByAuthorSlice.currentPage);
    const totalPages = useSelector((state: RootState) => state.searchByAuthorSlice.meta.totalPages);
    const hasNoResults = useSelector((state: RootState) => {
        const status = state.searchByAuthorSlice.status;
        const resultCount = Object.keys(state.searchByAuthorSlice.data.structureById).length;
        return (status === SearchState.success && resultCount === 0);
    });
    const totalResults = useSelector((state: RootState) =>{
        return Math.max(
            Object.keys(state.searchByAuthorSlice.data.structureById).length,
            state.searchByAuthorSlice.meta.totalResults
        );
    });
    const searchString = useSelector((state: RootState) => state.searchByAuthorSlice.meta.searchString);

    const showSummary = useSelector((state: RootState) => {
        const status = state.searchByAuthorSlice.status;
        const resultCount = Math.max(
            Object.keys(state.searchByAuthorSlice.data.structureById).length,
            state.searchByAuthorSlice.meta.totalResults
        );

        return resultCount !== 0 && [SearchState.processing, SearchState.started, SearchState.success].includes(status);
    });

    const onPageNavigate = (page: number) => {
        dispatch(searchStructureByAuthor({
            name: searchString,
            page
        }));
    }

    return (
        <div>
            <div className="search-layout__results-list">
                <div ref={containerRef}>
                    { showSummary ? <SearchSummary totalResults={totalResults}/> : null }
                    { hasNoResults ? <NoSearchResults /> : null }
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <Pagination
                            currentPage={currentPage}
                            maxPages={10}
                            totalPages={totalPages}
                            url='/search'
                            onPageNavigate={onPageNavigate}
                        />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
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
                        <SearchResults />
                    </div>
                </div>
            </div>
        </div>
    );
}
