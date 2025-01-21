import { Empty, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import Loader from "../../utils/loader/Loader";
import UserSearchCard from "../users/UserSearchCard";
import "./index.css";

export default function Search() {
  const currentUser = useRecoilValue(userState);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      if (!searchQuery?.trim()) return;
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .neq("id", currentUser?.id)
        .limit(10);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const {
    data: searchResults,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: handleSearch,
    staleTime: 1000 * 60,
  });

  return (
    <section className="search-container">
      {isLoading && <Loader />}
      <div>
        <Form
          className="search-form"
          name="searchForm"
          style={{
            maxWidth: 500,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item name="searchInput">
            <Input
              onChange={(e) => setSearchInput(e?.target?.value)}
              placeholder="Search username"
              autoFocus
            />
          </Form.Item>
        </Form>
      </div>
      <div>
        {searchResults?.map((user, id) => (
          <UserSearchCard user={user} key={id} />
        ))}
        {searchResults?.length == 0 && (
          <Empty description="No matching results" />
        )}
      </div>
    </section>
  );
}
