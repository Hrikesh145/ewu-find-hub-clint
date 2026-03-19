import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineFilter,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiArrowRight,
} from "react-icons/hi";

import "./AllItems.css";
import useAxios from "../../hooks/useAxios";

const FILTERS = ["All", "Lost", "Found"];

const STATUS_STYLES = {
  posted: { label: "Posted", cls: "badge--posted" },
  submitted: { label: "Submitted", cls: "badge--submitted" },
  "at-center": { label: "At Center", cls: "badge--center" },
  claimed: { label: "Claimed", cls: "badge--claimed" },
  returned: { label: "Returned ✓", cls: "badge--returned" },
};

const TYPE_STYLES = {
  lost: { label: "Lost", cls: "type--lost" },
  found: { label: "Found", cls: "type--found" },
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Spinner = () => (
  <div className="ai-spinner-wrap">
    <div className="ai-spinner" />
    <p>Loading items...</p>
  </div>
);

const Empty = ({ search }) => (
  <div className="ai-empty">
    <div className="ai-empty__icon">🔍</div>
    <h3 className="ai-empty__title">
      {search ? `No results for "${search}"` : "No items found"}
    </h3>
    <p className="ai-empty__sub">
      {search
        ? "Try a different search term or clear the filter."
        : "Be the first to report a lost or found item."}
    </p>
    <Link to="/addItems" className="ai-empty__btn">
      Report an item <HiArrowRight />
    </Link>
  </div>
);

const ItemCard = ({ item, view }) => {
  const type = TYPE_STYLES[item.postType] || { label: item.postType, cls: "" };
  const status = STATUS_STYLES[item.status] || { label: item.status, cls: "" };

  if (view === "list") {
    return (
      <div className="aic aic--list">
        <div className="aic__thumb-sm">
          {item.photoURL ? (
            <img src={item.photoURL} alt={item.title} />
          ) : (
            <span className="aic__thumb-fallback">📦</span>
          )}
        </div>
        <div className="aic__list-body">
          <div className="aic__list-top">
            <span className={`aic__type ${type.cls}`}>{type.label}</span>
            <h3 className="aic__title">{item.title}</h3>
          </div>
          <div className="aic__list-meta">
            <span>
              <HiOutlineTag /> {item.category}
            </span>
            <span>
              <HiOutlineLocationMarker /> {item.location}
            </span>
            <span>
              <HiOutlineCalendar /> {formatDate(item.date)}
            </span>
          </div>
        </div>
        <div className="aic__list-right">
          <span className={`aic__status ${status.cls}`}>{status.label}</span>
          <Link to={`/items/${item._id}`} className="aic__btn">
            View Details <HiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aic">
      <div className="aic__thumb">
        {item.photoURL ? (
          <img src={item.photoURL} alt={item.title} />
        ) : (
          <span className="aic__thumb-fallback">📦</span>
        )}
        <span className={`aic__type aic__type--abs ${type.cls}`}>
          {type.label}
        </span>
      </div>
      <div className="aic__body">
        <div className="aic__top">
          <h3 className="aic__title">{item.title}</h3>
          <span className={`aic__status ${status.cls}`}>{status.label}</span>
        </div>
        <p className="aic__desc">{item.description}</p>
        <div className="aic__meta">
          <span>
            <HiOutlineTag /> {item.category}
          </span>
          <span>
            <HiOutlineLocationMarker /> {item.location}
          </span>
          <span>
            <HiOutlineCalendar /> {formatDate(item.date)}
          </span>
        </div>
      </div>
      <div className="aic__foot">
        <div className="aic__contact">
          <div className="aic__av">
            {item.contact?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="aic__contact-name">
            {item.contact?.name || "Unknown"}
          </span>
        </div>
        <Link to={`/items/${item._id}`} className="aic__btn">
          View Details <HiArrowRight />
        </Link>
      </div>
    </div>
  );
};

const AllItems = () => {
  const axiosInstance = useAxios();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid");

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items", search, filter],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (filter !== "All") params.postType = filter.toLowerCase();

      const res = await axiosInstance.get("/items", { params });
      return res.data;
    },
    staleTime: 1000 * 30,
  });

  return (
    <div className="allitems-page">
      <div className="allitems-header">
        <div>
          <h1 className="allitems-title">
            Lost & Found <span>Items</span>
          </h1>
          <p className="allitems-sub">
            Browse all reported items from the EWU campus community.
          </p>
        </div>
        <Link to="/addItems" className="allitems-report-btn">
          Report an item <HiArrowRight />
        </Link>
      </div>

      <div className="allitems-controls">
        <div className="allitems-search">
          <HiOutlineSearch className="allitems-search__icon" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="allitems-search__input"
          />
          {search && (
            <button
              className="allitems-search__clear"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="allitems-right-controls">
          <div className="allitems-filters">
            <HiOutlineFilter className="allitems-filters__icon" />
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`allitems-filter ${filter === f ? "allitems-filter--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="allitems-view-toggle">
            <button
              className={`allitems-view-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
              title="Grid view"
            >
              <HiOutlineViewGrid />
            </button>
            <button
              className={`allitems-view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
              title="List view"
            >
              <HiOutlineViewList />
            </button>
          </div>
        </div>
      </div>

      {!isLoading && (
        <div className="allitems-count">
          <span>
            {items.length} item{items.length !== 1 ? "s" : ""} found
          </span>
          {(search || filter !== "All") && (
            <button
              className="allitems-clear"
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div className="ai-empty">
          <div className="ai-empty__icon">⚠️</div>
          <h3 className="ai-empty__title">Failed to load items</h3>
          <p className="ai-empty__sub">
            Please check your connection and try again.
          </p>
        </div>
      ) : items.length === 0 ? (
        <Empty search={search} />
      ) : (
        <div
          className={`allitems-grid ${view === "list" ? "allitems-grid--list" : ""}`}
        >
          {items.map((item) => (
            <ItemCard key={item._id} item={item} view={view} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllItems;
