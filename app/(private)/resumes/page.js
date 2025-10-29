"use client";

import "./Resumes.scss";
import { useCallback, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import moment from "moment";
import Image from "next/image";
import { LocalServer } from "@/app/utils";
import { useRouter } from "next/navigation";
import ToastNotification from "@/app/utils/Toast";
import { debounce, getErrorMessage } from "@/app/utils/helper";
import {
  TableX,
  Pagination,
  SubHeader,
  ButtonX,
  SortableHeader,
} from "@/app/shared";
import { Doc } from "@/public/images";
import { Badge } from "reactstrap";
import GenericField from "@/app/FormFields/sharedInput";
import { AiOutlineSearch } from "react-icons/ai";
import TooltipX from "@/app/shared/TooltipX";
import { Avatar } from "@/public/images";

const { ToastComponent } = ToastNotification;

export default function ResumesList() {
  const router = useRouter();
  const [loading, setloading] = useState();
  const [lastPage, setLastPage] = useState(1);
  const [resumeListing, setResumeListing] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [params, setParams] = useState({
    sortBy: "created_at",
    orderBy: "desc",
    pageSize: 20,
  });

  const fetchResumes = async (page = 1, query = "") => {
    setloading(true);
    try {
      const response = await LocalServer.get(
        `/api/resume/listing?page=${page}&view=${params.pageSize}&search=${query}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`
      );
      const data = response?.data?.data;
      setResumeListing(data);
      setloading(false);
      setLastPage(data?.last_page);
    } catch (error) {
      setloading(false);
      setResumeListing(false);
      ToastComponent("error", getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [params]);

  const handleEdit = (id) => {
    router.push(`/edit-resume/${id}`);
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query) => fetchResumes(1, query), 500),
    []
  );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    debouncedFetchSearchResults(query);
  };

  const handleSort = (column, order) => {
    setParams({ ...params, sortBy: column, orderBy: order });
  };

  const handlePageSize = (size) => {
    setParams({ ...params, pageSize: size });
  };

  const columns = [
    {
      key: "id",
      sortable: true,
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      sortable: true,
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      render: (value) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="generic-tbl__actions d-flex justify-content-center">
          <TooltipX text={"Edit Resume"} id={`${row?.id}a`}>
            <ButtonX
              logoClass="delete-logo"
              id={`tooltip-${row?.id}a`}
              clickHandler={() => {
                handleEdit(row?.id);
              }}
              className="btn-delete d-flex align-items-center"
            >
              <FiEdit className="me-2" />
            </ButtonX>
          </TooltipX>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="data-provider--main">
        <div className="col-lg-12">
          <div className="subheader--sec">
            <SubHeader
              SubHeaderLogo={Doc}
              headerTitle="Resumes"
              HeaderText=""
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <ButtonX
              className="create-btn btn-quote btn-quote--hover  d-flex align-items-center justify-content-center"
              size="lg"
              clickHandler={() => router.push("/create-resume")}
            >
              Create Resume
            </ButtonX>
            <GenericField
              type="text"
              name="search"
              value={search}
              placeholder="Search resumes"
              onChange={handleSearchChange}
              className="form-input br-16 pl-38 h-36 offWhite search-icon max-300"
              Icon={AiOutlineSearch}
            />
          </div>
          <TableX
            heading="Resumes List"
            params={params}
            className="provider-table resume--list-tbl generic--tbl"
            columns={columns}
            loading={loading}
            handleSort={handleSort}
            data={resumeListing?.data ?? []}
          />
          {!loading && resumeListing?.data?.length > 0 && (
            <div className="data-list--pagination d-flex justify-content-center align-item-center">
              <Pagination
                lastPage={lastPage}
                count={resumeListing}
                currentPage={currentPage}
                handlePageSize={handlePageSize}
                pageSize={params.pageSize}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  fetchResumes(page, search);
                }}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

