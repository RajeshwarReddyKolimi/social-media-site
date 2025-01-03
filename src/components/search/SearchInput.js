import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tooltip } from "antd";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";

export default function SearchInput({ setSearchResults }) {
  const user = useRecoilValue(userState);

  const handleSearch = async (values) => {
    try {
      if (!values?.searchInput?.trim()) return;
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .ilike("name", `%${values?.searchInput}%`)
        .neq("id", user?.id)
        .limit(10);
      setSearchResults(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
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
        onFinish={(values) => handleSearch(values)}
        onFinishFailed={(e) => console.log(e)}
        autoComplete="off"
      >
        <Form.Item name="searchInput">
          <Input placeholder="Search username" />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" icon={<SearchOutlined />} />
        </Form.Item>
      </Form>
    </div>
  );
}
