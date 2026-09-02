# Privacy-conscious measurement strategy

Frontend Index does not ship analytics in this branch. Measurement should be added only after ownership, retention, consent requirements, and a privacy policy are defined.

Useful product events:

- `search_performed` — query length and result count, not raw query text by default
- `search_result_opened` — result type and stable entry identifier
- `technology_opened` — stable technology identifier
- `lab_opened` and `lab_interacted` — stable lab and control identifiers
- `roadmap_section_opened` — stable section identifier
- `resource_clicked` and `career_path_opened` — stable destination identifiers
- `theme_changed` — selected theme

Prefer an aggregate, cookie-free setup with short retention and no cross-site profiling. Plausible, Fathom, or a small first-party endpoint are candidates; the correct choice depends on confirmed ownership and deployment constraints. Never send code samples, free-form search text, local preferences, or URL fragments that may contain user-provided content without an explicit need and review.
