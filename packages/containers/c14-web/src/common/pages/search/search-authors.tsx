import { useState, useRef, FormEvent } from 'react';
import { useAppStore } from '../../store';
import { Loader, NoSearchResults, Pagination, SearchTab } from '../../components';
import { Input } from '../../components/input';
import { StructuresList } from '../../components/structure-list/structure-list';
import { ErrorToast } from '../../components/toast';
import { SearchState } from '../../store/slices/search-by-author-page.slice';
import { Validator, useValidationError } from './common';

interface SearchFormData {
    name: string;
}

const renderItemValue = (item: any, search: any) => {
    search = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp('(^' + search.split(' ').join('|') + ')', 'gi');

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
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.data && Array.isArray(data.data)) {
            const responseData = data.data.map((item: any) => ({
                value: item.full,
                count: item.count,
            }));
            response(value, responseData);
            return;
        }
        response(value, []);
    })
    .catch(() => {
        response(value, []);
    });
}

const rangeValidator: Validator = {
    type: 'length-range',
    isValid(value: string) {
        return (value.length > 2 && value.length < 255);
    },
    message: 'Author should be between 3 and 255 symbols',
}

const SearchByAuthorForm = ({ onSubmit, initialValue }: { initialValue: string, onSubmit: (data: SearchFormData) => void }) => {
    const [name, setName] = useState(initialValue);
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);
    const error = useValidationError([rangeValidator], name);

    const autoCompleteOptions = {
        minChars: 1,
        delay: 100,
        source: autoCompleteSource,
        renderItemValue,
    };

    const handleNameChange = (nameValue: string) => {
        setName(nameValue);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
                    <button className="form-button btn" disabled={!!error} title={error}>Search</button>
                </div>
            </div>
        </form>
    )
}

const SearchSummary = ({ totalResults }: { totalResults: number }) => {
    return (
        <div className="search-layout__results-header">
            <h4 className="text-primary">Results: {totalResults}</h4>
        </div>
    )
}

const SearchResults = () => {
    const containerRef = useRef(null);
    const isLoading = useAppStore((s) => s.searchByAuthorSlice.isLoading);
    const structures = useAppStore((s) => {
        const structuresIds = s.searchByAuthorSlice.data.structureIds;
        const structuresById: any = s.searchByAuthorSlice.data.structureById;
        return structuresIds.map((id) => structuresById[id]).filter((item) => !!item);
    });
    const currentPage = useAppStore((s) => s.searchByAuthorSlice.search.page);
    const searchString = useAppStore((s) => s.searchByAuthorSlice.search.name);
    const totalPages = useAppStore((s) => s.searchByAuthorSlice.meta.totalPages);
    const hasNoResults = useAppStore((s) => {
        const status = s.searchByAuthorSlice.status;
        const resultCount = Object.keys(s.searchByAuthorSlice.data.structureById).length;
        return (status === SearchState.success && resultCount === 0);
    });
    const error = useAppStore((s) => s.searchByAuthorSlice.error);
    const totalResults = useAppStore((s) => {
        return Math.max(
            Object.keys(s.searchByAuthorSlice.data.structureById).length,
            s.searchByAuthorSlice.meta.totalResults
        );
    });
    const showSummary = useAppStore((s) => {
        const status = s.searchByAuthorSlice.status;
        const resultCount = Math.max(
            Object.keys(s.searchByAuthorSlice.data.structureById).length,
            s.searchByAuthorSlice.meta.totalResults
        );
        return resultCount !== 0 && [SearchState.processing, SearchState.started, SearchState.success].includes(status);
    });

    const searchStructureByAuthor = useAppStore((s) => s.searchStructureByAuthor);

    const onPageNavigate = (page: number) => {
        searchStructureByAuthor({ name: searchString, page });
    }

    return (
        <div>
            <div className="search-layout__results-list">
                <div ref={containerRef}>
                    {showSummary ? <SearchSummary totalResults={totalResults} /> : null}
                    {hasNoResults ? <NoSearchResults /> : null}
                    {error ? <ErrorToast error={error} /> : null}
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
    const page = useAppStore((s) => s.searchByAuthorSlice.search.page);
    const searchStructureByAuthor = useAppStore((s) => s.searchStructureByAuthor);

    const handleSubmit = (data: SearchFormData) => {
        searchStructureByAuthor({ ...data, page });
    }
    const searchString = useAppStore((s) => s.searchByAuthorSlice.meta.searchString);

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                <h2 className="text-primary">Crystal Structure Search</h2>
                <SearchTab />
            </header>
            <div className="app-layout-content">
                <div className="search-layout__page">
                    <div>
                        <SearchByAuthorForm onSubmit={handleSubmit} initialValue={searchString} />
                    </div>
                    <div>
                        <SearchResults />
                    </div>
                </div>
            </div>
        </div>
    );
}
