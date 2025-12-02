import { useMemo } from "react";
import { Select, MenuItem, Checkbox, styled } from "@mui/material";
import PropTypes from "prop-types";
import { useWindowSize } from "@uidotdev/usehooks";

// Constants
const IS_MOBILE_WIDTH = 768; // Mobile width threshold
const STYLES = {
  select: (isMobile, width) => ({
    width: width,
    "& .MuiSelect-icon": {
      color: "#4164E9",
    },
    border: "1px solid #3A74CA29",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #3A74CA29",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #3A74CA",
    },
    color: "#3A74CA",
    fontWeight: 500,
    fontSize: isMobile ? "10px" : "12px",
    height: "32px",
    textTransform: "capitalize",
    minHeight: "32px",
    paddingRight: "0px",
  }),
  menuItem: {
    color: "#3A74CA",
    fontWeight: 500,
    textTransform: "capitalize",
  },
};

// Styled Select component
const StyledSelect = styled(Select)({
  "& .MuiSelect-select": {
    padding: "4px 8px",
  },
});

/**
 * A customizable Select component with support for single/multiple selections,
 * icons, and responsive design.
 * @param {Object} props - Component props
 * @param {string|string[]} [props.value=""] - Selected value(s)
 * @param {Function} [props.setValue=() => {}] - Callback to update value
 * @param {Array} [props.options=[]] - Array of options (strings or objects)
 * @param {boolean} [props.isPlain=true] - Whether options are plain strings
 * @param {string} [props.valueKey=""] - Key for option value (if not plain)
 * @param {string} [props.displayKey=""] - Key for option display text
 * @param {boolean} [props.disable=false] - Disables the select
 * @param {string} [props.width="150px"] - Select width
 * @param {string} [props.size="small"] - Select size ("small" or "medium")
 * @param {boolean} [props.multiple=false] - Enables multiple selections
 * @param {string} [props.title=""] - Placeholder title
 * @param {string} [props.iconKey=""] - Key for option icon
 * @param {boolean} [props.displayEmpty=false] - Shows placeholder when empty
 */
const CustomSelect = ({
  value = "",
  setValue = () => {},
  options = [],
  isPlain = true,
  valueKey = "",
  displayKey = "",
  disable = false,
  width = "150px",
  size = "small",
  multiple = false,
  title = "",
  iconKey = "",
  displayEmpty = false,
}) => {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < IS_MOBILE_WIDTH;

  // Handle value change
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const parseDisplayValue = (value) => {
    if (isPlain) return value;
    else {
      let obj = options?.find((item) => item?.[valueKey] === value);
      return obj?.[displayKey];
    }
  };

  // Helper function to render icon for a given value
  const renderIcon = (value) => {
    if (!iconKey) return null;
    
    const item = isPlain 
      ? options.find(opt => opt === value)
      : options.find(opt => opt[valueKey] === value);
    
    if (!item || !item[iconKey]) return null;
    
    const iconValue = item[iconKey];
    return typeof iconValue === "string" ? (
      <img
        src={iconValue}
        alt="icon"
        className="h-4 w-4"
        onError={(e) => {
          e.target.style.display = "none"; // Hide broken images
        }}
      />
    ) : (
      iconValue
    );
  };

  // Render selected value
  const renderValue = (selected) => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return `Select ${title}`;
    }
    
    if (multiple && Array.isArray(selected)) {
      if (selected.length === options.length) {
        return `All ${title}`;
      }
      
      // For multiple selections, show icons and text
      return (
        <div className="flex items-center gap-1 flex-wrap">
          {selected.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              {renderIcon(item)}
              <span className="text-xs">{parseDisplayValue(item)}</span>
            </div>
          ))}
          {selected.length > 2 && (
            <span className="text-xs">+{selected.length - 2} more</span>
          )}
        </div>
      );
    }

    // For single selection, show icon and text
    const icon = renderIcon(selected);
    const displayText = parseDisplayValue(selected);
    
    if (icon) {
      return (
        <div className="flex items-center gap-1">
          {icon}
          <span>{displayText}</span>
        </div>
      );
    }
    
    return displayText;
  };

  // Memoized menu items
  const menuItems = useMemo(() => {
    if (!options.length) {
      return (
        <MenuItem disabled sx={STYLES.menuItem}>
          No options available
        </MenuItem>
      );
    }

    return options
      .map((item, idx) => {
        const valueItem = isPlain ? item : item[valueKey];
        const displayItem = isPlain ? item : item[displayKey];

        // Skip invalid options
        if (!valueItem || !displayItem) {
          console.warn(`Invalid option at index ${idx}:`, item);
          return null;
        }

        let icon = null;
        if (iconKey && item[iconKey]) {
          const iconValue = item[iconKey];
          icon =
            typeof iconValue === "string" ? (
              <img
                src={iconValue}
                alt="icon"
                className="h-6 w-6"
                onError={(e) => {
                  e.target.style.display = "none"; // Hide broken images
                }}
              />
            ) : (
              iconValue
            );
        }

        return (
          <MenuItem
            key={`${valueItem}-${idx}`}
            value={valueItem}
            sx={STYLES.menuItem}
          >
            <div className="flex items-center gap-1 text-[10px] md:text-xs">
              {multiple && (
                <Checkbox
                  checked={Array.isArray(value) && value.includes(valueItem)}
                  sx={{ padding: 0, marginRight: 1 }}
                  aria-label={`Select ${displayItem}`}
                />
              )}
              {icon}
              {displayItem}
            </div>
          </MenuItem>
        );
      })
      .filter(Boolean); // Remove null entries
  }, [options, isPlain, valueKey, displayKey, iconKey, multiple, value]);

  // Validate value
  const validValue = multiple
    ? Array.isArray(value)
      ? value.filter((v) =>
          options.some((item) => (isPlain ? item === v : item[valueKey] === v))
        )
      : []
    : options.some((item) =>
        isPlain ? item === value : item[valueKey] === value
      )
    ? value
    : "";

  return (
    <StyledSelect
      onChange={handleChange}
      value={validValue}
      disabled={disable}
      displayEmpty={displayEmpty}
      multiple={multiple}
      sx={STYLES.select(isMobile, width)}
      renderValue={renderValue}
      //   IconComponent={<HugeiconsIcon icon={ArrowDown01Icon} />}
      size={size}
      inputProps={{ "aria-label": `Select ${title}` }}
      aria-multiselectable={multiple}
    >
      {menuItems}
    </StyledSelect>
  );
};

// PropTypes for runtime validation
CustomSelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  setValue: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        valueKey: PropTypes.string,
        displayKey: PropTypes.string,
        iconKey: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      }),
    ])
  ),
  isPlain: PropTypes.bool,
  valueKey: PropTypes.string,
  displayKey: PropTypes.string,
  disable: PropTypes.bool,
  width: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
  multiple: PropTypes.bool,
  title: PropTypes.string,
  iconKey: PropTypes.string,
  displayEmpty: PropTypes.bool,
};

export default CustomSelect;
