$(document).ready(function() {
    const apiUrl = 'https://usmanlive.com/wp-json/api/stories/';
    let isEditing = false;

    // Load stories when page loads
    loadStories();

    // Submit form handler
    $('#storyForm').on('submit', function(e) {
        e.preventDefault();
        
        const story = {
            title: $('#title').val(),
            content: $('#content').val()
        };

        if (isEditing) {
            updateStory($('#storyId').val(), story);
        } else {
            createStory(story);
        }
    });

    // Cancel button handler
    $('#cancelBtn').on('click', function() {
        resetForm();
    });

    // Load all stories
    function loadStories() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(stories) {
                displayStories(stories);
            },
            error: function(xhr, status, error) {
                alert('Error loading stories: ' + error);
            }
        });
    }

    // Create new story
    function createStory(story) {
        $.ajax({
            url: apiUrl,
            method: 'POST',
            data: story,
            success: function(response) {
                loadStories();
                resetForm();
                alert('Story created successfully!');
            },
            error: function(xhr, status, error) {
                alert('Error creating story: ' + error);
            }
        });
    }

    // Update existing story
    function updateStory(id, story) {
        $.ajax({
            url: apiUrl + id,
            method: 'PUT',
            data: story,
            success: function(response) {
                loadStories();
                resetForm();
                alert('Story updated successfully!');
            },
            error: function(xhr, status, error) {
                alert('Error updating story: ' + error);
            }
        });
    }

    // Delete story
    function deleteStory(id) {
        if (confirm('Are you sure you want to delete this story?')) {
            $.ajax({
                url: apiUrl + id,
                method: 'DELETE',
                success: function(response) {
                    loadStories();
                    alert('Story deleted successfully!');
                },
                error: function(xhr, status, error) {
                    alert('Error deleting story: ' + error);
                }
            });
        }
    }

    // Display stories in the list
    function displayStories(stories) {
        const storiesList = $('#storiesList');
        storiesList.empty();
        
        // Update story count
        const validStories = stories.filter(story => story.title && story.content);
        $('#storyCount').text(`${validStories.length} ${validStories.length === 1 ? 'Story' : 'Stories'}`);

        stories.forEach(story => {
            if (story.title && story.content) {
                const storyElement = `
                    <div class="card story-card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-bookmark me-2 text-primary"></i>
                                ${story.title}
                            </h5>
                            <p class="card-text text-muted">${story.content}</p>
                            <div class="mt-3">
                                <button class="btn btn-warning btn-sm me-2" onclick="editStory('${story.id}', '${story.title}', '${story.content}')">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteStory('${story.id}')">
                                    <i class="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                storiesList.append(storyElement);
            }
        });
    }

    // Reset form to initial state
    function resetForm() {
        $('#storyForm')[0].reset();
        $('#storyId').val('');
        $('#submitBtn').html('<i class="fas fa-plus me-2"></i>Add Story');
        $('#formTitle').text('Add New Story');
        $('#cancelBtn').hide();
        isEditing = false;
    }

    // Make functions globally available
    window.editStory = function(id, title, content) {
        $('#storyId').val(id);
        $('#title').val(title);
        $('#content').val(content);
        $('#submitBtn').html('<i class="fas fa-save me-2"></i>Update Story');
        $('#formTitle').text('Edit Story');
        $('#cancelBtn').show();
        isEditing = true;
        
        // Scroll to form
        $('html, body').animate({
            scrollTop: $("#storyForm").offset().top - 100
        }, 500);
    };

    window.deleteStory = deleteStory;
}); 