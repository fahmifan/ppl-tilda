FROM python:3-slim

# Set an environment variable with the directory
# where we'll be running the app
ENV APP /app
# Create the directory and instruct Docker to operate
# from there from now on
RUN mkdir $APP
WORKDIR $APP
# Expose the port uWSGI will listen on
EXPOSE 5000

RUN apt-get update && apt-get install -y build-essential

# Copy the requirements file in order to install
# Python dependencies

COPY requirements.txt .
# Install Python dependencies
RUN pip3 install -r requirements.txt

# We copy the rest of the codebase into the image
COPY . .
# Finally, we run uWSGI with the ini file we
# created earlier
CMD [ "python3", "app.py" ]