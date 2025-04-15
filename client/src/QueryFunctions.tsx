import React, { ChangeEvent, SetStateAction } from "react";
import { QueryProps } from "./Components/types";

export function SetQuery(
  setQueries: React.Dispatch<SetStateAction<QueryProps>>
) {
  const handleQuerySearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleQuerySortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };

  const handleQueryOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      order: e.target.value,
    }));
  };

  const handleQueryLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      limit: parseInt(e.target.value),
    }));
  };

  const handlePaginationChange = () => {
    const handleNextPage = () => {
      setQueries((prev: QueryProps) => ({ ...prev, page: prev.page + 1 }));
    };
    const handlePerviousPage = () => {
      setQueries((prev: QueryProps) => ({
        ...prev,
        page: Math.max(prev.page - 1, 1),
      }));
    };

    return { handleNextPage, handlePerviousPage };
  };

  return {
    handlePaginationChange,
    handleQueryLimitChange,
    handleQueryOrderChange,
    handleQuerySearchChange,
    handleQuerySortByChange,
  };
}

export function QueryApi() {}
