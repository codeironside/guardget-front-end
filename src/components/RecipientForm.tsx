// components/RecipientForm.tsx - Improved search functionality
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Check, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import apiClient from "../api/client";

// TypeScript interfaces
interface UserSuggestion {
  id: string;
  username: string;
  email: string;
  imageurl?: string;
  role: string;
  firstName?: string;
  surName?: string;
  middleName?: string;
}

interface RecipientFormProps {
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
  confirmEmail: string;
  setConfirmEmail: (email: string) => void;
  showOtpInput: boolean;
}

// User suggestion service
const userService = {
  searchUsers: async (query: string) => {
    try {
      const response = await apiClient.get(
        `http://localhost:3124/api/v1/users/search?query=${encodeURIComponent(
          query
        )}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      return { status: "error", data: [] };
    }
  },

  getRecentContacts: async () => {
    try {
      const response = await apiClient.get(
        "http://localhost:3124/api/v1/users/recent-contacts"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent contacts:", error);
      return { status: "error", data: [] };
    }
  },
};

const RecipientForm: React.FC<RecipientFormProps> = ({
  recipientEmail,
  setRecipientEmail,
  confirmEmail,
  setConfirmEmail,
  showOtpInput,
}) => {
  const [allUsers, setAllUsers] = useState<UserSuggestion[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<"local" | "api">("local");

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchApiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Local filter function for better real-time matching
  const filterUsers = (
    query: string,
    users: UserSuggestion[]
  ): UserSuggestion[] => {
    if (!query || query.length < 1) return users;

    const lowerQuery = query.toLowerCase();
    return users.filter((user) => {
      // Check if the email contains the query
      if (user.email.toLowerCase().includes(lowerQuery)) return true;

      // Check if the username contains the query
      if (user.username && user.username.toLowerCase().includes(lowerQuery))
        return true;

      // Check if the full name contains the query
      const fullName = [user.firstName, user.middleName, user.surName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (fullName && fullName.includes(lowerQuery)) return true;

      return false;
    });
  };

  // Handle email input change with search
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientEmail(value);

    // Clear any existing timeouts
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchApiTimeoutRef.current) {
      clearTimeout(searchApiTimeoutRef.current);
    }

    // Show suggestions when there's some input
    if (value.length > 0) {
      setShowSuggestions(true);

      // First filter from existing allUsers list (instant feedback)
      if (allUsers.length > 0) {
        setSearchMode("local");
        setUserSuggestions(filterUsers(value, allUsers));
      }

      // Then if input is significant enough, search from API after a short delay
      if (value.length >= 2 || value.includes("@")) {
        setIsLoadingSuggestions(true);

        // Set a new timeout for API search
        searchApiTimeoutRef.current = setTimeout(() => {
          setSearchMode("api");
          searchUsers(value);
        }, 500); // Longer delay for API search
      }
    } else if (value.length === 0) {
      // If input is cleared, load recent contacts
      handleEmailFocus();
    } else {
      setShowSuggestions(false);
      setUserSuggestions([]);
    }
  };

  // Search users from API
  const searchUsers = async (query: string) => {
    try {
      const response = await userService.searchUsers(query);

      if (response.status === "success" && Array.isArray(response.data)) {
        const filteredUsers = response.data.filter(
          (user: UserSuggestion) => user.role !== "680a6a229243635113957910"
        );

        // Update both the filtered suggestions and the full user list
        setUserSuggestions(filteredUsers);
        setAllUsers((prev) => {
          // Merge with existing users, prioritizing new data
          const existingIds = new Set(prev.map((user) => user.id));
          const newUsers = filteredUsers.filter(
            (user) => !existingIds.has(user.id)
          );
          return [...prev, ...newUsers];
        });
      } else {
        // If API fails, fall back to local filtering
        setUserSuggestions(filterUsers(query, allUsers));
      }
    } catch (error) {
      console.error("Error searching users:", error);
      // Fall back to local filtering
      setUserSuggestions(filterUsers(query, allUsers));
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Load initial suggestions when email field is focused
  const handleEmailFocus = async () => {
    setShowSuggestions(true);

    // If we already have contacts loaded, show them immediately
    if (allUsers.length > 0) {
      setUserSuggestions(allUsers);
    }

    // Only fetch from API if we don't have users yet
    if (allUsers.length === 0) {
      setIsLoadingSuggestions(true);

      try {
        const response = await userService.getRecentContacts();
        if (response.status === "success" && Array.isArray(response.data)) {
          // Filter out users with the specific role ID
          const filteredUsers = response.data.filter(
            (user: UserSuggestion) => user.role !== "680a6a229243635113957910"
          );
          setAllUsers(filteredUsers);
          setUserSuggestions(filteredUsers);
        } else {
          setUserSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setUserSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }

    // If there's text in the input, filter the displayed suggestions
    if (recipientEmail.length > 0) {
      setUserSuggestions(filterUsers(recipientEmail, allUsers));
    }
  };

  // Handle selecting a user suggestion
  const handleSelectSuggestion = (email: string) => {
    setRecipientEmail(email);
    setConfirmEmail(email); // Auto-fill the confirmation email
    setShowSuggestions(false);
  };

  // Format user name for display
  const formatUserName = (user: UserSuggestion): string => {
    if (user.firstName || user.surName) {
      return [user.firstName, user.middleName, user.surName]
        .filter(Boolean)
        .join(" ");
    }
    return user.username || user.email.split("@")[0];
  };

  // Highlight matching parts of text
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query || query.length < 1) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    if (lowerText.includes(lowerQuery)) {
      const startIndex = lowerText.indexOf(lowerQuery);
      const endIndex = startIndex + lowerQuery.length;

      return (
        <>
          {text.substring(0, startIndex)}
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 font-medium px-1 rounded">
            {text.substring(startIndex, endIndex)}
          </span>
          {text.substring(endIndex)}
        </>
      );
    }

    return text;
  };

  return (
    <>
      {/* Recipient Email Field */}
      <div>
        <label
          htmlFor="recipientEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Recipient's Email
        </label>
        <div className="relative">
          {showOtpInput ? (
            <input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              className="block w-full pl-10 pr-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm opacity-75"
              disabled
            />
          ) : (
            <input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              onChange={handleEmailChange}
              onFocus={handleEmailFocus}
              className="block w-full pl-10 pr-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter recipient's email address"
              autoComplete="off"
              required
            />
          )}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          {/* Email suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && !showOtpInput && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-base overflow-auto focus:outline-none max-h-64"
              >
                {isLoadingSuggestions && searchMode === "api" ? (
                  <div className="flex justify-center items-center py-3">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : userSuggestions && userSuggestions.length > 0 ? (
                  userSuggestions.map((user: UserSuggestion) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectSuggestion(user.email)}
                      className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
                    >
                      {user.imageurl ? (
                        <img
                          src={user.imageurl}
                          alt={formatUserName(user)}
                          className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {highlightMatch(formatUserName(user), recipientEmail)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {highlightMatch(user.email, recipientEmail)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {recipientEmail.length > 0
                      ? `No users found matching "${recipientEmail}"`
                      : "Type to search for users"}
                  </div>
                )}

                {/* Show "Searching..." at the bottom while loading API results */}
                {isLoadingSuggestions &&
                  searchMode === "api" &&
                  userSuggestions.length > 0 && (
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-600 flex items-center">
                      <LoadingSpinner size="xs" className="mr-2" />
                      Searching for more results...
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirm Email Field - only show when not in OTP mode */}
      {!showOtpInput && (
        <div>
          <label
            htmlFor="confirmEmail"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm Recipient's Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="confirmEmail"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2.5 rounded-md border ${
                confirmEmail &&
                recipientEmail &&
                confirmEmail !== recipientEmail
                  ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                  : confirmEmail &&
                    recipientEmail &&
                    confirmEmail === recipientEmail
                  ? "border-green-300 dark:border-green-500 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2`}
              placeholder="Confirm recipient's email address"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {confirmEmail && recipientEmail ? (
                confirmEmail === recipientEmail ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {confirmEmail &&
            recipientEmail &&
            confirmEmail !== recipientEmail && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Email addresses do not match
              </p>
            )}
        </div>
      )}
    </>
  );
};

export default RecipientForm;
